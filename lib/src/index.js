"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require("set-interval-async/dynamic"), setIntervalAsync = _a.setIntervalAsync, clearIntervalAsync = _a.clearIntervalAsync;
var Tiper = /** @class */ (function () {
    function Tiper(element, options) {
        var _this = this;
        this.options = {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus sagittis dapibus. Fusce lacinia dui tortor, at porttitor quam luctus ut. Aliquam gravida commodo eros ac dictum. Nam ac odio at sem interdum dictum eget sit amet lorem. Vivamus enim velit, condimentum sed neque non, dignissim viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sodales, neque eget tincidunt efficitur, nisi orci vestibulum diam, eget fringilla dui dolor sed nisi. Pellentesque feugiat augue in felis interdum, non tempus dui volutpat. Sed pulvinar, massa non placerat scelerisque, nunc tellus posuere felis, a ultricies mi libero id velit. Mauris sed arcu dolor. Mauris varius a metus sit amet pulvinar. Proin rhoncus non quam in vulputate. ",
            variation: 0.45,
            wordsPerMinute: 40,
            pauseTimeout: 525,
            pauseOnSpace: false,
            pauseOnEndOfSentence: true,
            showCaret: false,
            glitch: false,
            onFinishedTyping: function () {
                console.log("Finished typing!");
            },
        };
        this.currentIndex = 0;
        this.getWords = function () {
            var words = _this.options.text.match(/\w+/g);
            return words;
        };
        this.getTypingSpeed = function () {
            var ms = _this.options.text.length / (_this.options.wordsPerMinute * 4.7) + 10;
            return ms;
        };
        this.updateElementText = function (char) {
            var previousTextContent = _this.element.textContent;
            var text = _this.options.text.substring(0, previousTextContent.length) + char;
            var caret = _this.options.showCaret ? "▮" : "";
            _this.element.textContent = text + caret;
        };
        this.stopTyping = function () {
            return clearIntervalAsync(_this.typingInterval);
        };
        this.handleTypingPause = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stopTyping();
                        return [4 /*yield*/, this.delay(this.options.pauseTimeout)];
                    case 1:
                        _a.sent();
                        this.beginTyping();
                        return [2 /*return*/];
                }
            });
        }); };
        this.delay = function (ms) {
            return new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        };
        this.applyVariation = function () { return __awaiter(_this, void 0, void 0, function () {
            var timeout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeout = Math.floor(this.options.variation *
                            Math.random() *
                            this.getRandomArbitrary(100, 500));
                        return [4 /*yield*/, this.delay(timeout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.insertNextChar = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentChar, nextChar, isSpace, isEndOfSentence, shouldPause;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentChar = this.options.text.charAt(this.currentIndex);
                        nextChar = this.options.text.charAt(this.currentIndex + 1);
                        isSpace = currentChar.match(/\s/g);
                        isEndOfSentence = (currentChar.match(/[\.\?\!]/g) && !nextChar.match(/[\.\?\!]/g)) ||
                            currentChar.match(/\\n/g);
                        shouldPause = (this.options.pauseOnSpace && isSpace) ||
                            (this.options.pauseOnEndOfSentence && isEndOfSentence);
                        this.updateElementText(currentChar);
                        if (!this.options.variation) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applyVariation()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.currentIndex >= this.options.text.length - 1)) return [3 /*break*/, 4];
                        if (this.options.onFinishedTyping)
                            this.options.onFinishedTyping();
                        return [4 /*yield*/, this.stopTyping()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        this.currentIndex += 1;
                        if (!shouldPause) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.handleTypingPause()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        this.getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        this.applyGlitch = function () { return __awaiter(_this, void 0, void 0, function () {
            var text, randomCharPosition, beforeChar, afterChar, glitch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = this.element.textContent;
                        randomCharPosition = this.getRandomArbitrary(1, text.length);
                        beforeChar = text.substring(0, randomCharPosition);
                        afterChar = text.substring(randomCharPosition, text.length);
                        glitch = beforeChar + "\u25AE " + afterChar;
                        this.element.textContent = glitch;
                        return [4 /*yield*/, this.delay(this.options.variation * this.getRandomArbitrary(100, 200))];
                    case 1:
                        _a.sent();
                        this.element.textContent = "" + beforeChar + afterChar;
                        return [2 /*return*/];
                }
            });
        }); };
        this.beginTyping = function () {
            var ms = _this.getTypingSpeed();
            _this.typingInterval = setIntervalAsync(_this.insertNextChar, ms);
            if (_this.options.glitch)
                _this.glitchInterval = setIntervalAsync(_this.applyGlitch, 5000);
            console.log("Beginning to type at " + _this.options.wordsPerMinute + " words per minute.");
            console.log("Typing interval is:", ms);
        };
        this.element = element;
        if (options)
            this.options = __assign(__assign({}, this.options), options);
        this.options.text = this.options.text.trim();
    }
    return Tiper;
}());
exports.default = Tiper;
//# sourceMappingURL=index.js.map