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
import { setIntervalAsync, clearIntervalAsync } from "set-interval-async/dynamic";
import { getRandomArbitrary, createSpan, delay } from './util';
var Tiper = /** @class */ (function () {
    function Tiper(container, options) {
        var _this = this;
        this.options = {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus sagittis dapibus. Fusce lacinia dui tortor, at porttitor quam luctus ut. Aliquam gravida commodo eros ac dictum. Nam ac odio at sem interdum dictum eget sit amet lorem. Vivamus enim velit, condimentum sed neque non, dignissim viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sodales, neque eget tincidunt efficitur, nisi orci vestibulum diam, eget fringilla dui dolor sed nisi. Pellentesque feugiat augue in felis interdum, non tempus dui volutpat. Sed pulvinar, massa non placerat scelerisque, nunc tellus posuere felis, a ultricies mi libero id velit. Mauris sed arcu dolor. Mauris varius a metus sit amet pulvinar. Proin rhoncus non quam in vulputate. ",
            hesitation: 0.45,
            wordsPerMinute: 40,
            pauseTimeout: 525,
            pauseOnSpace: false,
            pauseOnEndOfSentence: true,
            showCaret: false,
            caretType: "normal",
            glitch: false,
            onFinishedTyping: function () {
                console.log("Finished typing!");
            },
        };
        this.currentIndex = 0;
        this.typingListener = {
            finishedTyping: false,
            finishedTypingListener: function (_) { },
            get isFinishedTyping() {
                return this.finishedTyping;
            },
            set isFinishedTyping(finishedTyping) {
                this.finishedTyping = finishedTyping;
                this.finishedTypingListener(finishedTyping);
            },
            registerListener: function (listener) {
                this.finishedTypingListener = listener;
            },
        };
        this.trim = function (str) {
            return str.trim();
        };
        this.getTypingSpeed = function () {
            return _this.currentText.length / (_this.options.wordsPerMinute * 4.7) + 10;
        };
        this.getCaretCharacter = function () {
            return _this.options.caretType === "normal" ? "▮" : "_";
        };
        this.setCurrentText = function (text) {
            _this.currentText = text;
            _this.currentIndex = 0;
            console.log("Setting current text to:", text);
        };
        this.setCurrentTextElement = function (currentTextElement) {
            _this.currentTextElement = currentTextElement;
        };
        this.getCurrentText = function () {
            return _this.currentText;
        };
        this.getTextByRange = function (start, end) {
            var text = _this.getCurrentText();
            var str = text.substring(start, end);
            return str;
        };
        this.getCaretLength = function () {
            return _this.options.showCaret ? 1 : 0;
        };
        this.sourceTextIsTargetLength = function () {
            var caretLength = _this.getCaretLength();
            var textContentLength = _this.currentTextElement.textContent.length - caretLength;
            var currentTextLength = _this.currentText.length - 1;
            console.log("Current text length vs actual container text length:", currentTextLength, textContentLength);
            return textContentLength == currentTextLength;
        };
        this.observeTyping = function () {
            return new Promise(function (resolve, reject) {
                _this.typingListener.registerListener(function (isFinished) {
                    if (isFinished)
                        resolve();
                });
            });
        };
        this.setFinishedTyping = function (finishedTyping) {
            _this.typingListener.isFinishedTyping = finishedTyping;
        };
        this.resetFinishedTyping = function () {
            _this.setFinishedTyping(false);
        };
        this.updateElementText = function (char) {
            var previousTextContent = _this.currentTextElement.textContent;
            var lastIndex = previousTextContent.length;
            var text = _this.getTextByRange(0, lastIndex) + char;
            _this.currentTextElement.textContent = text;
        };
        this.stopTyping = function () {
            _this.activateCaret();
            return clearIntervalAsync(_this.typingInterval);
        };
        this.pauseTyping = function (ms) { return __awaiter(_this, void 0, void 0, function () {
            var timeOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeOut = ms !== null && ms !== void 0 ? ms : this.options.pauseTimeout;
                        this.stopTyping();
                        return [4 /*yield*/, delay(timeOut)];
                    case 1:
                        _a.sent();
                        this.resumeTyping();
                        return [2 /*return*/];
                }
            });
        }); };
        this.resumeTyping = function () {
            _this.initializeTypingInterval();
            _this.deactivateCaret();
        };
        this.applyVariation = function () { return __awaiter(_this, void 0, void 0, function () {
            var timeout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeout = Math.floor(this.options.hesitation *
                            Math.random() *
                            getRandomArbitrary(100, 500));
                        return [4 /*yield*/, delay(timeout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getCharAt = function (index) {
            var text = _this.currentText;
            var char = text.charAt(index);
            return char;
        };
        this.isEndOfSentence = function (currentChar, nextChar) {
            var isEndOfSentence = (/[\.\?\!]/.test(currentChar) && !/[\.\?\!]/.test(nextChar)) ||
                /\\n/.test(currentChar);
            return isEndOfSentence;
        };
        this.getShouldPause = function (currentChar, nextChar) {
            var isSpace = /\s/.test(currentChar);
            var isEndOfSentence = _this.isEndOfSentence(currentChar, nextChar);
            var shouldPause = (_this.options.pauseOnSpace && isSpace) ||
                (_this.options.pauseOnEndOfSentence && isEndOfSentence);
            return shouldPause;
        };
        this.insertCurrentChar = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentChar, nextChar, shouldPause, isFinished;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentChar = this.getCharAt(this.currentIndex);
                        nextChar = this.getCharAt(this.currentIndex + 1);
                        shouldPause = this.getShouldPause(currentChar, nextChar);
                        isFinished = this.sourceTextIsTargetLength();
                        this.updateElementText(currentChar);
                        if (!this.options.hesitation) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applyVariation()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!isFinished) return [3 /*break*/, 4];
                        if (this.options.onFinishedTyping)
                            this.options.onFinishedTyping();
                        this.setFinishedTyping(true);
                        return [4 /*yield*/, this.stopTyping()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        this.currentIndex += 1;
                        if (!shouldPause) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.pauseTyping()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        this.activateCaret = function () {
            if (_this.caretElement)
                _this.caretElement.classList.add("blinking");
        };
        this.deactivateCaret = function () {
            if (_this.caretElement)
                _this.caretElement.classList.remove("blinking");
        };
        this.appendElementToContainer = function (element) {
            _this.container.appendChild(element);
        };
        this.initializeTextElement = function () {
            var textElement = createSpan("tiper-js-text");
            _this.appendElementToContainer(textElement);
            _this.setCurrentTextElement(textElement);
        };
        this.initializeCaret = function () {
            if (_this.caretElement)
                _this.caretElement.remove();
            var caret = createSpan("tiper-js-caret");
            caret.innerText = _this.getCaretCharacter();
            _this.appendElementToContainer(caret);
            _this.caretElement = caret;
            _this.activateCaret();
        };
        this.initializeGlitchEffect = function () {
            _this.glitchInterval = setIntervalAsync(_this.applyGlitch, 5000);
            console.log("Beginning to type at " + _this.options.wordsPerMinute + " words per minute.");
        };
        this.initializeTypingInterval = function () {
            var ms = _this.getTypingSpeed();
            _this.typingInterval = setIntervalAsync(_this.insertCurrentChar, ms);
            console.log("Typing interval is:", ms);
        };
        this.setElementText = function (text) {
            _this.currentTextElement.textContent = text;
        };
        this.resetElementText = function () {
            _this.container.innerHTML = "";
        };
        this.applyGlitch = function () { return __awaiter(_this, void 0, void 0, function () {
            var text, randomCharPosition, beforeChar, afterChar, glitch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = this.container.textContent;
                        randomCharPosition = getRandomArbitrary(1, text.length);
                        beforeChar = text.substring(0, randomCharPosition);
                        afterChar = text.substring(randomCharPosition, text.length);
                        glitch = beforeChar + "\u25AE " + afterChar;
                        this.setElementText(glitch);
                        return [4 /*yield*/, delay(this.options.hesitation * getRandomArbitrary(100, 200))];
                    case 1:
                        _a.sent();
                        this.setElementText("" + beforeChar + afterChar);
                        return [2 /*return*/];
                }
            });
        }); };
        this.beginTyping = function (text, reset) { return __awaiter(_this, void 0, void 0, function () {
            var currentText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentText = text || this.options.text;
                        if (reset)
                            this.resetElementText();
                        this.initializeTextElement();
                        this.setCurrentText(currentText);
                        this.resetFinishedTyping();
                        this.initializeTypingInterval();
                        if (this.options.glitch)
                            this.initializeGlitchEffect();
                        if (this.options.showCaret)
                            this.initializeCaret();
                        this.deactivateCaret();
                        return [4 /*yield*/, this.observeTyping()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.line = function (text) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.beginTyping(text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        }); };
        this.container = container;
        if (this.container === null)
            throw new Error("tiper-js: Invalid container element.");
        if (options)
            this.options = __assign(__assign({}, this.options), options);
        this.options.text = this.trim(this.options.text);
        this.setCurrentText(this.options.text);
    }
    return Tiper;
}());
export default Tiper;
//# sourceMappingURL=index.js.map