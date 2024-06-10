"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadVar = void 0;
function loadVar(name, optional) {
    const result = process.env[name];
    if (result == null && !optional) {
        throw new Error(`${name} is required`);
    }
    return result;
}
exports.loadVar = loadVar;
//# sourceMappingURL=loadVar.js.map