import mongoose from "mongoose";
import { Collection } from "../collections";

export interface LPSwaps {
    lp_address: string,
    lp_tokens: { 
        offer_denom: string,
        offer_address: string, 
        ask_denom: string,
        ask_address: string,
    },
    block_height: number,
    block_time_stamp: string,
    txid: string,
    sender: string,
    offer_amount: number,
    offer_amount_in_uusd: number,
    ask_amount: number,
    ask_amount_in_uusd: number,
    belief_price: number,
    max_spread: number,
    actual_slippage: number,
}

const swap = new mongoose.Schema({
    lp_address: String,
    lp_tokens: { 
        offer_denom: String,
        offer_address: String, 
        ask_denom: String,
        ask_address: String,
    },
    block_height: Number,
    block_time_stamp: String,
    txid: String,
    sender: String,
    offer_amount: Number,
    offer_amount_in_uusd: Number,
    ask_amount: Number,
    ask_amount_in_uusd: Number,
    belief_price: Number,
    max_spread: Number,
    actual_slippage: Number,
});

export const LP_SWAPS_MODEL = mongoose.model(Collection.LP_SWAPS, swap, Collection.LP_SWAPS);