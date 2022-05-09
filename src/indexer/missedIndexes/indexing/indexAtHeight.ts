import decodeAndQueryEventLog from "../../../parsers/decodeQuery";
import { destructureBlock } from "../../../parsers/destructure";
import filterAndCategorize from "../../../parsers/filterCategorize";
import indexTxs from "../../latestBlock/indexTxs";
import getBlockInfo from "./getBlockInfo";

export default async function indexAtHeight (block_height: number) {

    const block_data = await getBlockInfo(block_height);
    /* 
    * Triggered Every Minute if any missing blocks are present
    * Recursively fetches until something is returned
    */

    const { block_info, txs: protos } = destructureBlock(block_data);
    const { full_tx_info } = await decodeAndQueryEventLog(protos);
    const { categorized_txs, txs_len } = filterAndCategorize(full_tx_info);

    /* GUARD CLAUSE: No transactions to index. */
    if (txs_len !== 0) {
        await indexTxs(categorized_txs, block_info);
    }

    console.log("Missing Block Height: ", block_info.height, " has been indexed");
}