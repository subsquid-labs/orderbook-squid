import BN from "./BN";

export default function tai64ToDate(num: bigint) {
    const dateStr = new BN((num - BigInt(Math.pow(2, 62)) - BigInt(10)).toString()).times(1000).toString();
    return new Date(+dateStr);
}
