import axios from "axios";
import { destructureBlock } from "../../parsers/destructure";
import decodeAndQueryEventLog from "../../parsers/decodeQuery";
import filterAndCategorize from "../../parsers/filterCategorize";
import cacheMissedBlocks from "../missedIndexes/caching_local/cacheMissedBlocks";
import indexTxs from "./indexTxs";
import { state } from "../../app";
import makeTable from "../../helpers/makeTable";
import { BLOCK_ENDPOINT } from "../../constants/endpoints";

let latest_block_height: number = Number.NEGATIVE_INFINITY;

export default async function indexLatestBlock () {
    let block_data: any;

    try {
        block_data = await axios.get(`${BLOCK_ENDPOINT}/latest`);
    } catch { return };
    /* 
    * 1 second job schedule, 6+ fetch opportunities per block
    * If every job failes to fetch latest block, the block fails to be indexed
    * Chances of this happening is only if something is wrong with terra LCD
    * Or this instance's network craps out
    */

    const { block_info, txs: protos } = destructureBlock(block_data);

    /* GUARD CLAUSE: Not a new block or LCD returns non-latest block height (happens) */
    if (latest_block_height >= block_info.height) {
        return;
    }
    
    if (block_info.height - latest_block_height > 1 
        && latest_block_height !== Number.NEGATIVE_INFINITY) {
        /* 
        * In case missed block(s) happen, missed block number(s) can be 
        * saved for parallel indexing via another indexing instance
        * Such as a follow-up indexer, or an api that triggers manual indexing
        * This pretty much guarantees all blocks will be indexed
        */
        cacheMissedBlocks(latest_block_height, block_info.height);
        state.total_missed_blocks++;
    }
    
    latest_block_height = block_info.height;

    let total_index_time = Date.now();
    const { full_tx_info, event_log_delay } = await decodeAndQueryEventLog(protos);
    const { categorized_txs, txs_len } = filterAndCategorize(full_tx_info);

    let total_saved = 0;
    /* GUARD CLAUSE: No transactions to index. */
    if (txs_len !== 0) {
        total_saved = await indexTxs(categorized_txs, block_info);
    };

    state.total_indexed += total_saved;
    total_index_time = (Date.now() - total_index_time) / 1000;

    if (total_index_time > state.longest_index_duration)
        state.longest_index_duration = total_index_time;

    const num_missed_indexes = Object.entries(state.current_missed_indexes)
    .map(([_, index]: any) => index.length).reduce((p, n) => p + n, 0);

    const log = makeTable(
        block_info.height,
        full_tx_info.length,
        event_log_delay.toFixed(3),
        total_index_time.toFixed(3),
        total_saved,
        new Date(Date.now()).toString(),
        state.current_missed_blocks,
        num_missed_indexes,
    );

    console.table(log);
    console.log("===============================================================");
}