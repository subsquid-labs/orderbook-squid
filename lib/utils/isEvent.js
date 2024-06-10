"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFieldsInObject = exports.getEventFields = void 0;
const isEvent = (eventName, object, abi) => checkFieldsInObject(object, getEventFields(eventName, abi));
exports.default = isEvent;
function getEventFields(eventName, jsonAbi) {
    const jsonAbiEventTypes = jsonAbi.types.find((jsonAbiType) => jsonAbiType.type === `struct ${eventName}`);
    return jsonAbiEventTypes?.components?.map(({ name }) => name);
}
exports.getEventFields = getEventFields;
function checkFieldsInObject(obj, fields) {
    return typeof obj === "object" && fields.every((field) => field in obj);
}
exports.checkFieldsInObject = checkFieldsInObject;
//# sourceMappingURL=isEvent.js.map