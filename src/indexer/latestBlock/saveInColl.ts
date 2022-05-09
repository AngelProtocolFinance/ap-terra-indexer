import { Category } from "../../parsers/filterCategorize";
import { BlockInfo } from "../../parsers/destructure";
import { swapToSchema } from "../../parsers/txToSchema";
import { Collection } from "../../database/collections";
import cacheMissedIndexes from "../missedIndexes/caching_local/cacheMissedIndexes";
import { LP_SWAPS_MODEL } from "../../database/models/swaps";

async function saveNativeSwaps (txs: any[], block_info: BlockInfo) {
    if (txs.length === 0) return;

    const tx_schemas = txs.map(tx => swapToSchema(tx, block_info));

    try {
        await LP_SWAPS_MODEL.insertMany(tx_schemas);
    } catch (err) {
        cacheMissedIndexes(Collection.LP_SWAPS, tx_schemas);
    }
};

async function saveCW20Swaps (txs: any[], block_info: BlockInfo) {
    if (txs.length === 0) return;

    const tx_schemas = txs.map(tx => swapToSchema(tx, block_info));

    try {
        await LP_SWAPS_MODEL.insertMany(tx_schemas);
    } catch (err) {
        cacheMissedIndexes(Collection.LP_SWAPS, tx_schemas);
    }
};

export const saveInCorrectSpot = {
    [Category.SWAP_NATIVE]: async (txs: any, block_info: BlockInfo) => saveNativeSwaps(txs, block_info),
    [Category.SWAP_CW20]: async (txs: any, block_info: BlockInfo) => saveCW20Swaps(txs, block_info),
};
