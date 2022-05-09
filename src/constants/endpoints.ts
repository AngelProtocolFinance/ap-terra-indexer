import { config } from "dotenv";

config();

export const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
export const BLOCK_ENDPOINT = `${process.env.LCD_ENDPOINT}/blocks`;
export const TX_ENDPOINT = `${process.env.LCD_ENDPOINT}/cosmos/tx/v1beta1/txs`
export const ANC_MARKET_CONTRACT = "terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s";