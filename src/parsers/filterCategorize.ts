import filterMsgType from "./filterMsgType";

export enum Category {
    SWAP_NATIVE = "swap_native",
    SWAP_CW20 = "swap_cw20",
}

export type CategorizedTxs = {
    [Category.SWAP_NATIVE]: any[];
    [Category.SWAP_CW20]: any[];
}

function getCategory (tx: any): Partial<Category> | null {
    const max_spread = tx.execute_msg.swap?.max_spread;
    const belief_price = tx.execute_msg.swap?.belief_price;

    let category: Partial<Category> = null;

    if (max_spread && belief_price) { //LP Pair Swap Message Standard
        const native = tx.execute_msg.swap.offer_asset.info.native_token;
        category = native ? Category.SWAP_NATIVE : Category.SWAP_CW20;
    }

    return category;
}

export default function filterAndCategorize (txs: any[]) {
    const filtered_txs = filterMsgType(txs);

    const categorized_txs: CategorizedTxs = {
        [Category.SWAP_NATIVE]: [],
        [Category.SWAP_CW20]: [],
    }

    filtered_txs.forEach(tx => {
        const category = getCategory(tx);

        /* GUARD CLAUSE: If transaction is not in indexable category, continue to next TX */
        if (!category) return;

        categorized_txs[category].push(tx);
    })

    let txs_len = 0, empty_check = Object.entries(categorized_txs);
    for (const [_, array] of empty_check) {
        txs_len += array.length;
    }

    return { categorized_txs, txs_len };
}