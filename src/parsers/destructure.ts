export type BlockInfo = {
    height: number;
    time: string;
}

export type DeconBlockData = {
    block_info: BlockInfo;
    txs: any[];
}

export type AnchorStateModel = {
    block_height: number,
    aust_exchange_rate: number,
    aust_total_supply: number,
    total_liabilities: number,
}

export function destructureBlock (latest_block: any): DeconBlockData {
    const {
        data: {
            block: {
                header: {
                    height,
                    time,
                },
                data: {
                    txs,
                },
            }
        }
    } = latest_block;

    const decon_block_data: DeconBlockData = {
        block_info: {
            height: parseInt(height),
            time,
        },
        txs,
    }

    return decon_block_data;
};

export function destructureAnchorState (anchor_state: any): AnchorStateModel {
    const {
        height,
        result: {
            total_liabilities,
            prev_aterra_supply,
            prev_exchange_rate,
        }
    } = anchor_state;

    return {
        block_height: parseInt(height),
        aust_exchange_rate: parseFloat(prev_exchange_rate),
        aust_total_supply: parseInt(prev_aterra_supply),
        total_liabilities: parseFloat(total_liabilities),
    }
}