import { config } from "dotenv";

config();

export const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
export const LCD_API_KEY = `${process.env.LCD_API_KEY}`;
export const BLOCK_ENDPOINT = `${process.env.LCD_ENDPOINT}/blocks`;
export const TX_ENDPOINT = `${process.env.LCD_ENDPOINT}/cosmos/tx/v1beta1/txs`;