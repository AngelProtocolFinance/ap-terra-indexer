import { state } from "../../../app";
import { Collection } from "../../../database/collections";

export default function cacheMissedIndexes (type: Partial<Collection>, schema: any) {
    state.current_missed_indexes[type].push(schema);
}