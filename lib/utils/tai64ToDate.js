"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BN_1 = __importDefault(require("./BN"));
function tai64ToDate(num) {
    const dateStr = new BN_1.default((BigInt(num) - BigInt(Math.pow(2, 62)) - BigInt(10)).toString()).times(1000).toString();
    return new Date(+dateStr);
}
exports.default = tai64ToDate;
//# sourceMappingURL=tai64ToDate.js.map