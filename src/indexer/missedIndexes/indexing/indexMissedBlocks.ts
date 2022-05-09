import { state } from "../../../app";
import indexAtHeight from "./indexAtHeight";

export default async function indexMissedBlocks() {
    if (state.current_missed_blocks.length === 0) return;

    do {
        const height = state.current_missed_blocks[state.current_missed_blocks.length - 1];
        await indexAtHeight(height);
        state.current_missed_blocks.pop();
        state.total_missed_blocks_indexed--;
    } while (state.current_missed_blocks.length !== 0);
};