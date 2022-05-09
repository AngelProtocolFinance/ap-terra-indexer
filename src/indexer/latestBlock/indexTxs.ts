import { type CategorizedTxs } from "../../parsers/filterCategorize";
import { BlockInfo } from "../../parsers/destructure";
import { saveInCorrectSpot } from "./saveInColl";

export default async function indexTxs (categorized_txs: CategorizedTxs, block_info: BlockInfo) {
    const save_queue = [];
    let total_docs_saved = 0;

    for (const [category, txs] of Object.entries(categorized_txs)) {
        total_docs_saved += txs.length;
        save_queue.push(saveInCorrectSpot[category](txs, block_info));
    }

    await Promise.all(save_queue);
    return total_docs_saved;
}