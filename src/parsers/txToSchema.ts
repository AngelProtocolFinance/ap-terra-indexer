import { BlockInfo } from "./destructure"
import eventLogParser, { EventLog } from "./eventLogParser"

export const swapToSchema = (tx: any, block_info: BlockInfo) => {
    // const wasm_log = eventLogParser(tx.event_log, EventLog.SWAP);
    // console.log(JSON.stringify(wasm_log, null, 2));

    return {
        lp_address: "",
        lp_tokens: { 
            offer_denom: "", 
            offer_address: "",
            ask_denom: "", 
            ask_address: "",
        },
        block_height: block_info.height,
        block_time_stamp: block_info.time,
        txid: tx.tx_hash,
        sender: tx.sender,
        offer_amount: "",
        offer_amount_in_uusd: 0,
        ask_amount: 0,
        ask_amount_in_uusd: 0,
        belief_price: 0,
        max_spread: 0,
        actual_slippage: 0,
    }
}