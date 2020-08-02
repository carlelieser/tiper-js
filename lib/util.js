"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.getRandomArbitrary = void 0;
exports.getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
};
exports.delay = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};
//# sourceMappingURL=util.js.map