"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotOrderChangeEvent = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
let SpotOrderChangeEvent = class SpotOrderChangeEvent {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.SpotOrderChangeEvent = SpotOrderChangeEvent;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], SpotOrderChangeEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], SpotOrderChangeEvent.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], SpotOrderChangeEvent.prototype, "newBaseSize", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], SpotOrderChangeEvent.prototype, "identifier", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], SpotOrderChangeEvent.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], SpotOrderChangeEvent.prototype, "txId", void 0);
exports.SpotOrderChangeEvent = SpotOrderChangeEvent = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], SpotOrderChangeEvent);
//# sourceMappingURL=spotOrderChangeEvent.model.js.map