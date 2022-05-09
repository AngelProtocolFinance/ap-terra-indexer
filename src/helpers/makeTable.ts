export default function makeTable (
    block_height: number,
    tx_len: number,
    log_delay: string,
    total_index_time: string,
    total_saved: number,
    date: string,
    missed_blocks: number[],
    num_missed_indexes: number,
) {
    return {
        ["Block"]: block_height,
        ["Total # of Txs"]: tx_len,
        ["Total Saved"]: total_saved,
        ["LCD Event Log Delay"]: parseFloat(log_delay),
        ["Total Index Time"]: parseFloat(total_index_time),
        ["Indexed At"]: date,
        ["Missed Blocks"]: JSON.stringify(missed_blocks),
        ["# of Missed Indexes"]: num_missed_indexes,
    }
}