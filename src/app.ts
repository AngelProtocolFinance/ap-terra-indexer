import chalk from "chalk";
import mongoose from "mongoose";
import cron from "node-cron";
import express from "express";
import indexChainState from "./indexer/chainState";
import indexLatestBlock from "./indexer/latestBlock";
import indexMissedBlocks from "./indexer/missedIndexes/indexing/indexMissedBlocks";
import indexMissedIndexes from "./indexer/missedIndexes/indexing/indexMissedIndexes";
import IndexerState from "./indexer/state";
import { MONGO_CONNECTION } from "./constants/endpoints";

export const state = new IndexerState();
const app = express();

app.get("/state", (_, res) => {
    res.send({
        longest_index_duration: state.longest_index_duration,
        total_indexed: state.total_indexed,
        total_missed_blocks: state.total_missed_blocks,
        missed_blocks: state.current_missed_blocks,
        missed_indexes: state.current_missed_indexes,
    });
});

app.listen(3000, () => {
    console.log(chalk.green("Step 1: "), "Express Server Started");

    try {
        mongoose.connect(MONGO_CONNECTION);
        console.log(chalk.green("Step 2: "), "I am One with the Mongo");
    } catch {
        console.log(chalk.red("Error: "), "Mongo had the high ground");
        process.exit(0);
    } finally {
        console.log(chalk.blueBright("Step 3: "), "Indexer Starting...");
        // cron.schedule("*/1 * * * * *", indexChainState);
        cron.schedule("*/1 * * * * *", indexLatestBlock);
    
        // /* Missed Data Collectors */
        cron.schedule("1 * * * * *", indexMissedBlocks);
        cron.schedule("2 * * * * *", indexMissedIndexes);
    };
});