const msgTypes = ["MsgExecuteContract"];

export default function filterMsgType (msgs: any[]): any[] {
    let filtered = msgs.filter(msg => msgTypes.some(type => msg["@type"].endsWith(type)));
    return filtered;
}