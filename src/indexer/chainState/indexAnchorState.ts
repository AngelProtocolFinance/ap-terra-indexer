import axios from "axios";
import { ANC_MARKET_CONTRACT } from "../../constants/endpoints";
import { Collection } from "../../database/collections";
import { ANCHOR_STATES_MODEL } from "../../database/models/anchor_state";
import { destructureAnchorState } from "../../parsers/destructure";
import cacheMissedIndexes from "../missedIndexes/caching_local/cacheMissedIndexes";
/*
* Anchor State LCD Query Block Height is slightly behind the LCD latestBlock query height.
* So we need to keep track of it's own block height to update in silo.
*/
let block_height = Number.NEGATIVE_INFINITY;
let initial_height = Number.MAX_SAFE_INTEGER;

export const ANCHOR_STATE = (height: number) => 
`https://lcd.terra.dev/wasm/contracts/${ANC_MARKET_CONTRACT}/store?query_msg=%7B%22state%22:%7B%22block_height%22:${height}%7D%7D`;

export async function indexAnchorState () {
    let anchor_state: any;
    try {
        const { data: _anchor_state } = await axios.get(`${ANCHOR_STATE(initial_height ?? block_height)}`);
        anchor_state = _anchor_state;
    } catch { return };

    const state_model = destructureAnchorState(anchor_state);

    if (block_height === state_model.block_height) return;

    block_height = state_model.block_height;

    if (!initial_height) {
        try {
            await ANCHOR_STATES_MODEL.create(state_model);
            console.log("Anchor State Indexed At Block Height: ", state_model.block_height);
        } catch {
            cacheMissedIndexes(Collection.ANCHOR_STATES, state_model);
        }
    } else {
        initial_height = null;
    }
};