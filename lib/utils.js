"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Utils = {
    getRandomArbitrary: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    shuffleArray: function (arr) {
        var arrCopy = __spreadArrays(arr);
        for (var k = arrCopy.length - 1; k > 0; k--) {
            var index = Math.floor(Math.random() * k);
            var temp = arrCopy[k];
            arrCopy[k] = arrCopy[index];
            arrCopy[index] = temp;
        }
        return arrCopy;
    },
};
module.exports = Utils;
//# sourceMappingURL=utils.js.map