export enum EventLog {
    SWAP = 0,
}

function swapLogParser (event_log: any) {
    const [wasm_log] = event_log.filter((log: any) => log.type === "wasm");
    return wasm_log.attributes;
}

export default function eventLogParser (event_log: any, parse_type: Partial<EventLog>) {
    switch (parse_type) {
        case EventLog.SWAP: 
            return swapLogParser(event_log);
        default: return;
    }
}