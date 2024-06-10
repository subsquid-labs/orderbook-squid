"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecodedLogs = void 0;
const abi_coder_1 = require("@fuel-ts/abi-coder");
const transactions_1 = require("@fuel-ts/transactions");
/** @hidden */
function getDecodedLogs(receipts, mainAbi, externalAbis = {}) {
    /**
     * This helper decodes logs from transaction receipts.
     * It loops through all receipts and decodes two types of logs:
     * - ReceiptType.LogData
     * - ReceiptType.Log
     *
     * The "mainAbi" parameter represents the ABI of the main contract used to create the transaction
     * or the ABI from a script used within a "BaseInvocationScope" context.
     * The "externalAbis" parameter is a record of contract ABIs that are also part of the transaction.
     * These ABIs were added using `contract.addContracts` or through a multicall with `contract.multiCall`.
     *
     * @param receipts - The array of transaction result receipts.
     * @param mainAbi - The ABI of the script or main contract.
     * @param externalAbis - The record of external contract ABIs.
     * @returns An array of decoded logs from Sway projects.
     */
    return receipts.reduce((logs, receipt) => {
        //log type generated from abi
        if (receipt.type === transactions_1.ReceiptType.LogData ||
            receipt.type === transactions_1.ReceiptType.Log) {
            const interfaceToUse = new abi_coder_1.Interface(externalAbis[receipt.id] || mainAbi);
            const data = receipt.type === transactions_1.ReceiptType.Log
                ? new abi_coder_1.BigNumberCoder("u64").encode(receipt.val0)
                : receipt.data;
            const [decodedLog] = interfaceToUse.decodeLog(data, receipt.val1.toString());
            logs.push(decodedLog);
        }
        return logs;
    }, []);
}
exports.getDecodedLogs = getDecodedLogs;
//# sourceMappingURL=decoder.js.map