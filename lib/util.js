export var getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
};
export var createSpan = function (className) {
    var el = document.createElement("span");
    el.className = className;
    return el;
};
export var delay = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};
//# sourceMappingURL=util.js.map