import { Tx as Tx_pb } from "@terra-money/terra.proto/cosmos/tx/v1beta1/tx";
import { Tx } from "@terra-money/terra.js";
import { createHash } from "crypto";
import axios from "axios";
import { delay } from "../helpers/delay";
import { TX_ENDPOINT } from "../constants/endpoints";

type Decoded = {
    decoded_tx: Tx;
    tx_hash: string;
};

//Tx Hash Generation
function getTxHash(tx: string): string {
    const s256Buffer = createHash(`sha256`).update(Buffer.from(tx, `base64`)).digest();
    const txbytes = new Uint8Array(s256Buffer);
    return Buffer.from(txbytes.slice(0, 32)).toString(`hex`).toUpperCase();
};

//LCD Tx Encoding: Protobuf + base64. 
function txDecode (encodedTx: string): Decoded {
    const tx_hash = getTxHash(encodedTx);
    const tx_pb = Tx_pb.decode(Buffer.from(encodedTx, 'base64'));
    const decoded_tx = Tx.fromProto(tx_pb);
    return { decoded_tx, tx_hash };
};

/* 
* lcd doesn't return the event log right after the latest block update.
* So initial queries may throw an error. 
* Catching and recursively querying until proper data is returned.
*/
async function getEventLog (tx_hash: string) {
    await delay(1000); //Buffer so that this func doesn't spam LCD.

    try {
        return await axios.get(`${TX_ENDPOINT}/${tx_hash}`);
        // const event_log = full_log?.tx_response?.logs[0].events ?? [];
        // return event_log;
    } catch {
        return await getEventLog(tx_hash);
    };
}

/* 
* The Decoded Tx only returns the parameters of execution.
* Hence we have to manually generate tx_hash, query it for raw log, and then parse the log.
*/
async function parse (tx: any) {
    const { decoded_tx, tx_hash } = txDecode(tx);
    const new_tx = JSON.parse(decoded_tx.body.messages[0].toJSON());

    try {
        const event_log = await getEventLog(tx_hash);
        new_tx.tx_hash = tx_hash;
        new_tx.event_log = event_log;
    } catch (err) {
        console.log("Error getting Event Log");
    }

    return new_tx;
}

export default async function decodeAndQueryEventLog (protos: string[]): Promise<any> {
    const full_txs = [];

    let i = 0;
    for (const proto of protos) {
        i++;
        full_txs.push(parse(proto));
    }

    let event_log_delay = Date.now();
    const full_tx_info = await Promise.all(full_txs);
    event_log_delay = (Date.now() - event_log_delay) / 1000;
    return { full_tx_info, event_log_delay };
};