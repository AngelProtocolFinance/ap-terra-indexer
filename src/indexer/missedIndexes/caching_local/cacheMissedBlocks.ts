import { state } from "../../../app";

export default function cacheMissedBlocks (legacy_height: number, new_height: number) {
    for (let block_num = new_height - 1; block_num > legacy_height; block_num--) {
        state.current_missed_blocks.push(block_num);
    };
};