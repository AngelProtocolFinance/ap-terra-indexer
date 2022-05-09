import chalk from "chalk";
import { state } from "../../../app";
import { Collection, collections_arr } from "../../../database/collections";
import { LP_SWAPS_MODEL } from "../../../database/models/swaps";

async function indexMissed (indexes: Partial<Collection>) {
    try {
        // TODO: Fix this to switch
        await LP_SWAPS_MODEL.insertMany(state.current_missed_indexes[indexes]);
        state.current_missed_indexes[indexes] = [];
        console.log(
            `${chalk.green(state.current_missed_indexes[indexes.length])} missed ${indexes} has been indexed`
        );
    } catch { return };
};

export default async function indexMissedIndexes () {
    for (const indexes of collections_arr)
        if (state.current_missed_indexes[indexes].length !== 0)
            await indexMissed(indexes);
};