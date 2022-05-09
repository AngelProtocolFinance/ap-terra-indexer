import { collections_arr } from "../database/collections";

export default class IndexerState {

    longest_index_duration: number;
    total_indexed: number;
    total_missed_blocks: number;
    total_missed_blocks_indexed: number;
    current_missed_blocks: number[];
    current_missed_indexes: any;

    constructor () {
        this.longest_index_duration = 0;
        this.total_indexed = 0;
        this.total_missed_blocks = 0;
        this.total_missed_blocks_indexed = 0;
        this.current_missed_blocks = [];
        this.current_missed_indexes = collections_arr.reduce((p, n) => {
            return Object.assign(p, { [n]: [] });
        }, {});
    };
};