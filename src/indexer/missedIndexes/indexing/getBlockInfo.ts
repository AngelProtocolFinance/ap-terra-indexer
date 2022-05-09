import axios from "axios";
import { BLOCK_ENDPOINT, LCD_API_KEY } from "../../../constants/endpoints";
import { delay } from "../../../helpers/delay";

export default async function getBlockInfo (block_height: number) {
    try {
        return await axios.get(`${BLOCK_ENDPOINT}/${block_height}`, , {
            headers: {
                Authorization: LCD_API_KEY
            }
        });
    } catch (e) {
        await delay(1000);
        return await getBlockInfo(block_height);
    }
}