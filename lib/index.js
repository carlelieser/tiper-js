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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dynamic_1 = require("set-interval-async/dynamic");
var closest_key_1 = __importDefault(require("./closest-key"));
var utils_1 = __importDefault(require("./utils"));
var Tiper = /** @class */ (function () {
    function Tiper(container, options) {
        var _this = this;
        this.options = {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus sagittis dapibus. Fusce lacinia dui tortor, at porttitor quam luctus ut. Aliquam gravida commodo eros ac dictum. Nam ac odio at sem interdum dictum eget sit amet lorem. Vivamus enim velit, condimentum sed neque non, dignissim viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sodales, neque eget tincidunt efficitur, nisi orci vestibulum diam, eget fringilla dui dolor sed nisi. Pellentesque feugiat augue in felis interdum, non tempus dui volutpat. Sed pulvinar, massa non placerat scelerisque, nunc tellus posuere felis, a ultricies mi libero id velit. Mauris sed arcu dolor. Mauris varius a metus sit amet pulvinar. Proin rhoncus non quam in vulputate. ",
            hesitation: 0.45,
            accuracy: 0.95,
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
        this.charsToDelete = 0;
        this.repeatAmount = 0;
        this.mandatoryStop = false;
        this.typingListener = {
            finishedTyping: false,
            finishedTypingListener: function (val) { },
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
        this.throwError = function (message) {
            throw new Error("tiper-js: " + message);
        };
        this.setRepeatSettings = function (repeatAmount, repeatAction) {
            _this.repeatAmount = repeatAmount;
            _this.repeatAction = repeatAction;
            if (_this.repeatAmount)
                _this.options.accuracy = 1;
        };
        this.setMandatoryStop = function (mandatoryStop) {
            _this.mandatoryStop = mandatoryStop;
        };
        this.setCharsToDelete = function (charsToDelete) {
            if ((_this.charsToDelete == 1 && charsToDelete === 0) ||
                charsToDelete <= 0) {
                _this.setFinishedTyping(true);
                _this.stopTyping(false);
            }
            _this.charsToDelete = charsToDelete;
        };
        this.setRepeatValue = function (getValue) {
            _this.repeatValue = getValue;
        };
        this.getWords = function () {
            var words = _this.getCurrentText().match(/\w+/g);
            return words;
        };
        this.getAverageWordLength = function () {
            var wordLengths = [];
            var words = _this.getWords();
            for (var i = 0; i < words.length; i++) {
                var word = words[i];
                wordLengths.push(word.length);
            }
            var sum = wordLengths.reduce(function (previous, current) { return (current += previous); });
            var avg = sum / wordLengths.length;
            return avg;
        };
        this.getTypingSpeed = function () {
            var avg = _this.getAverageWordLength();
            var ms = Math.abs(Math.floor(((60 / _this.options.wordsPerMinute) * (1 / avg) * 1000) / 4) - 20);
            var normalized = ms < 10 ? 10 : ms;
            return normalized;
        };
        this.getCaretCharacter = function () {
            var char = _this.options.caretType === "normal" ? "▮" : "_";
            return char;
        };
        this.generateArrayWithSameValues = function (value, length) {
            var arr = new Array();
            for (var j = 0; j < length; j++) {
                arr[j] = value;
            }
            return arr;
        };
        this.generateBinaryTypoMap = function () {
            var totalChars = _this.currentText.length;
            if (_this.options.accuracy === 1)
                return _this.generateArrayWithSameValues("1", totalChars);
            var percentageAccurate = _this.options.accuracy * 100;
            var correctChars = Math.floor((totalChars / 100) * percentageAccurate);
            var wrongChars = Math.floor((totalChars - correctChars) / 2);
            var diff = totalChars - wrongChars;
            correctChars = correctChars + diff;
            var correctMap = _this.generateArrayWithSameValues("1", correctChars);
            var incorrectMap = _this.generateArrayWithSameValues("0", wrongChars);
            var unshuffledBinaryMap = __spreadArrays(correctMap, incorrectMap);
            var binaryMap = utils_1.default.shuffleArray(unshuffledBinaryMap);
            return binaryMap;
        };
        this.getClosestKey = function (key) {
            var closestKey = new closest_key_1.default();
            var keyboardKey = closestKey.find(key);
            return keyboardKey;
        };
        this.generateTypos = function () {
            var typos = _this.generateBinaryTypoMap().join("");
            return typos;
        };
        this.setCurrentTypos = function (typos) {
            _this.currentTypos = typos;
        };
        this.updateTypos = function () {
            var typos = _this.generateTypos();
            _this.setCurrentTypos(typos);
        };
        this.setCurrentText = function (text) {
            _this.currentText = text;
            _this.setCurrentIndex(0);
            _this.updateTypos();
        };
        this.setCurrentTextElement = function (currentTextElement) {
            _this.currentTextElement = currentTextElement;
        };
        this.setCurrentIndex = function (index) {
            _this.currentIndex = index;
        };
        this.getCurrentText = function () {
            return _this.currentText;
        };
        this.getTextByRange = function (start, end, useOriginal) {
            var text = useOriginal ? _this.getCurrentText() : _this.getElementText();
            var str = text.substring(start, end);
            return str;
        };
        this.getCaretLength = function () {
            var caretLength = _this.options.showCaret ? 1 : 0;
            return caretLength;
        };
        this.sourceTextIsTargetLength = function () {
            if (!_this.currentTextElement)
                return;
            var caretLength = _this.getCaretLength();
            var textContentLength = _this.currentTextElement.textContent.length - caretLength;
            var currentTextLength = _this.currentText.length - 1;
            return textContentLength >= currentTextLength;
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
        this.updateElementText = function (char, reverse) {
            var previousTextContent = _this.currentTextElement.textContent;
            var lastIndex = previousTextContent.length;
            var text = reverse
                ? _this.getTextByRange(0, lastIndex - 1)
                : _this.getTextByRange(0, lastIndex) + char;
            _this.setElementText(text);
        };
        this.stopTyping = function (mandatory) {
            if (mandatory === void 0) { mandatory = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.mandatoryStop)
                                this.setMandatoryStop(mandatory);
                            this.activateCaret();
                            this.setFinishedTyping(true);
                            return [4 /*yield*/, dynamic_1.clearIntervalAsync(this.typingInterval)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.pause = function (ms, mandatoryStop) {
            if (mandatoryStop === void 0) { mandatoryStop = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var timeOut;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeOut = typeof ms === "number" ? ms : this.options.pauseTimeout;
                            return [4 /*yield*/, this.stopTyping(mandatoryStop)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.delay(timeOut)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.pauseTyping = function () {
            return _this.pause(null, true);
        };
        this.resume = function (reverse, reset, mandatoryStop, setMandatoryStop) {
            if (setMandatoryStop)
                _this.setMandatoryStop(mandatoryStop);
            if (_this.mandatoryStop)
                return;
            _this.setMandatoryStop(mandatoryStop);
            if (reset)
                _this.resetFinishedTyping();
            _this.initializeTypingInterval(reverse);
            _this.deactivateCaret();
        };
        this.resumeTyping = function () {
            return _this.resume(false, true, false, true);
        };
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
                        timeout = Math.ceil(Math.floor(this.options.hesitation *
                            Math.random() *
                            utils_1.default.getRandomArbitrary(20, 300)));
                        return [4 /*yield*/, this.delay(timeout)];
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
            var isEndOfSentence = (currentChar.match(/[\.\?\!]/g) && !nextChar.match(/[\.\?\!]/g)) ||
                currentChar.match(/\\n/g);
            return isEndOfSentence;
        };
        this.getShouldPause = function (currentChar, nextChar) {
            var isSpace = currentChar.match(/\s/g);
            var isEndOfSentence = _this.isEndOfSentence(currentChar, nextChar);
            var shouldPause = (_this.options.pauseOnSpace && isSpace) ||
                (_this.options.pauseOnEndOfSentence && isEndOfSentence);
            return shouldPause;
        };
        this.fixTypoAtIndex = function (index) {
            var typosCopy = _this.currentTypos.slice(0);
            var typosArray = typosCopy.split("");
            typosArray.splice(index, 1, "1");
            typosCopy = typosArray.join("");
            _this.setCurrentTypos(typosCopy);
        };
        this.applyAndCorrectTypo = function () { return __awaiter(_this, void 0, void 0, function () {
            var spaces, thinkingTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spaces = utils_1.default.getRandomArbitrary(1, 3);
                        thinkingTime = utils_1.default.getRandomArbitrary(50, 300);
                        return [4 /*yield*/, this.applyVariation()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.back(spaces)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.applyVariation()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.delay(thinkingTime)];
                    case 4:
                        _a.sent();
                        this.fixTypoAtIndex(this.currentIndex + spaces);
                        this.resume(false, true);
                        return [2 /*return*/];
                }
            });
        }); };
        this.insertCurrentChar = function (reverse) { return __awaiter(_this, void 0, void 0, function () {
            var currentChar, nextChar, shouldPause, isFinished, shouldBeTypo, finalChar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentTextElement)
                            this.initializeTextElement();
                        if (!(!this.typingListener.isFinishedTyping && !this.mandatoryStop)) return [3 /*break*/, 9];
                        currentChar = this.getCharAt(this.currentIndex);
                        nextChar = this.getCharAt(this.currentIndex + 1);
                        shouldPause = this.getShouldPause(currentChar, nextChar);
                        isFinished = this.typingListener.isFinishedTyping ||
                            this.sourceTextIsTargetLength();
                        shouldBeTypo = this.currentTypos.charAt(this.currentIndex) === "0";
                        finalChar = shouldBeTypo
                            ? this.getClosestKey(currentChar)
                            : currentChar;
                        this.updateElementText(finalChar, reverse);
                        if (!this.options.hesitation) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applyVariation()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(shouldBeTypo && !reverse)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.applyAndCorrectTypo()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(isFinished && !reverse && !shouldBeTypo)) return [3 /*break*/, 6];
                        if (this.options.onFinishedTyping)
                            this.options.onFinishedTyping();
                        this.setFinishedTyping(true);
                        return [4 /*yield*/, this.stopTyping()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        this.setCurrentIndex(this.currentIndex + (reverse ? -1 : 1));
                        if (reverse)
                            this.setCharsToDelete(this.charsToDelete - 1);
                        if (!(shouldPause && (reverse ? this.charsToDelete > 0 : true))) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.pause()];
                    case 7:
                        _a.sent();
                        this.resume(reverse, true, false);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.stopTyping(true)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        this.setCaretElement = function (caretElement) {
            _this.caretElement = caretElement;
        };
        this.activateCaret = function () {
            if (_this.caretElement)
                _this.caretElement.classList.add("blinking");
        };
        this.deactivateCaret = function () {
            if (_this.caretElement)
                _this.caretElement.classList.remove("blinking");
        };
        this.createSpan = function (className) {
            var el = document.createElement("span");
            el.className = className;
            return el;
        };
        this.removeAllElements = function (element) {
            var allElements = document.getElementsByClassName(element.className);
            for (var i = 0; i < allElements.length; i++) {
                var el = allElements[i];
                el.remove();
            }
        };
        this.insertElementInContainer = function (element, prepend) {
            _this.removeAllElements(element);
            var action = prepend ? "prepend" : "appendChild";
            _this.container[action](element);
        };
        this.initializeTextElement = function () {
            var textElement = _this.createSpan("tiper-js-text");
            _this.insertElementInContainer(textElement, true);
            _this.setCurrentTextElement(textElement);
        };
        this.initializeCaret = function () {
            if (_this.options.showCaret) {
                if (_this.caretElement)
                    _this.caretElement.remove();
                var caret = _this.createSpan("tiper-js-caret");
                caret.innerText = _this.getCaretCharacter();
                _this.insertElementInContainer(caret);
                _this.setCaretElement(caret);
                _this.activateCaret();
            }
        };
        this.initializeGlitchEffect = function () { return __awaiter(_this, void 0, void 0, function () {
            var ms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.glitchInterval) return [3 /*break*/, 2];
                        return [4 /*yield*/, dynamic_1.clearIntervalAsync(this.glitchInterval)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        ms = utils_1.default.getRandomArbitrary(50, 2000);
                        this.glitchInterval = dynamic_1.setIntervalAsync(this.applyGlitch, ms);
                        console.log("Beginning to type at " + this.options.wordsPerMinute + " words per minute.");
                        return [2 /*return*/];
                }
            });
        }); };
        this.initializeTypingInterval = function (reverse) {
            var ms = _this.getTypingSpeed();
            _this.typingInterval = dynamic_1.setIntervalAsync(function () { return _this.insertCurrentChar(reverse); }, ms);
            console.log("Typing interval is:", ms);
        };
        this.setElementText = function (text) {
            _this.currentTextElement.textContent = text;
        };
        this.getElementText = function () {
            if (_this.currentTextElement)
                return _this.currentTextElement.textContent;
            return "";
        };
        this.resetElementText = function () {
            _this.container.innerHTML = "";
            _this.setCurrentIndex(0);
            _this.setCurrentTextElement(false);
            _this.setFinishedTyping(false);
            _this.initializeCaret();
        };
        this.getRandomGlitchChar = function () {
            var index = utils_1.default.getRandomArbitrary(128, 254);
            var char = String.fromCharCode(index);
            return char;
        };
        this.generateGlitchText = function () {
            var text = _this.getElementText();
            var textArray = text.split("");
            for (var i = 0; i < textArray.length / 2; i++) {
                var randomIndex = utils_1.default.getRandomArbitrary(0, textArray.length);
                var glitch = _this.getRandomGlitchChar();
                textArray.splice(randomIndex, 1, glitch);
            }
            var glitchText = textArray.join("");
            return glitchText;
        };
        this.applyGlitch = function () { return __awaiter(_this, void 0, void 0, function () {
            var glitchText, showTime, originalText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        glitchText = this.generateGlitchText();
                        showTime = this.options.hesitation * utils_1.default.getRandomArbitrary(100, 2000);
                        this.setElementText(glitchText);
                        return [4 /*yield*/, this.delay(showTime)];
                    case 1:
                        _a.sent();
                        originalText = this.getTextByRange(0, this.currentIndex, true);
                        this.setElementText(originalText);
                        this.initializeGlitchEffect();
                        return [2 /*return*/];
                }
            });
        }); };
        this.beginTyping = function (text, reset) { return __awaiter(_this, void 0, void 0, function () {
            var currentText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentText = text ? text : this.options.text;
                        if (reset)
                            this.resetElementText();
                        this.initializeTextElement();
                        this.setCurrentText(currentText);
                        this.resetFinishedTyping();
                        this.setMandatoryStop(false);
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
        this.line = function (text, reset) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (reset)
                            this.resetElementText();
                        return [4 /*yield*/, this.beginTyping(text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.back = function (chars) {
            if (chars === void 0) { chars = _this.getElementText().length; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stopTyping(false)];
                        case 1:
                            _a.sent();
                            this.resetFinishedTyping();
                            this.setCharsToDelete(chars);
                            this.initializeTypingInterval(true);
                            return [4 /*yield*/, this.observeTyping()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.repeat = function (repeatAmount, repeatAction) { return __awaiter(_this, void 0, void 0, function () {
            var shouldRepeatForever, timesToRepeat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shouldRepeatForever = repeatAmount === "forever";
                        timesToRepeat = shouldRepeatForever ? Infinity : repeatAmount;
                        this.setRepeatSettings(timesToRepeat, repeatAction);
                        if (!(this.repeatAmount > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, repeatAction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.continueRepeat()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.continueRepeat = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repeat(this.repeatAmount - 1, this.repeatAction)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.generateRepeatAction = function (action, delay, fixedValue, returnAsync) {
            if (delay === void 0) { delay = 2000; }
            if (returnAsync === void 0) { returnAsync = true; }
            var actionString = (returnAsync ? "async () => {" : "") + "\n" + (fixedValue ? "" : "let value = this.repeatValue();") + "\nawait this['" + action + "'](" + (fixedValue ? "`" + fixedValue + "`" : "value") + ");\nawait this.delay(1000);\nawait this.back(" + (fixedValue ? fixedValue.length : "value.length") + ");\nawait this.delay(" + delay + ");\n" + (returnAsync ? "}" : "");
            return actionString;
        };
        this.easyRepeat = function (config) { return __awaiter(_this, void 0, void 0, function () {
            var sanitizedArray, asyncFunctionString;
            var _this = this;
            return __generator(this, function (_a) {
                sanitizedArray = config.values.map(function (text) {
                    return _this.generateRepeatAction(config.action, config.delay, text, false);
                });
                asyncFunctionString = "async () => {" + sanitizedArray.join("\n") + "}";
                return [2 /*return*/, this.repeat(config.repeatAmount, eval(asyncFunctionString))];
            });
        }); };
        this.targetRepeat = function (config) { return __awaiter(_this, void 0, void 0, function () {
            var action, getValue, repeatAmount, delay, asyncFunctionString;
            return __generator(this, function (_a) {
                action = config.action, getValue = config.getValue, repeatAmount = config.repeatAmount, delay = config.delay;
                this.setRepeatValue(getValue);
                asyncFunctionString = this.generateRepeatAction(action, delay);
                return [2 /*return*/, this.repeat(repeatAmount, eval(asyncFunctionString))];
            });
        }); };
        this.setAccuracy = function (accuracy) {
            _this.options.accuracy = accuracy;
        };
        this.destroy = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stopTyping(true)];
                    case 1:
                        _a.sent();
                        this.resetElementText();
                        return [2 /*return*/, false];
                }
            });
        }); };
        this.isFinished = function () {
            return _this.sourceTextIsTargetLength();
        };
        this.resetText = this.resetElementText;
        this.container = container;
        if (this.container === null)
            this.throwError("Invalid container element.");
        if (options)
            this.options = __assign(__assign({}, this.options), options);
        this.options.text = utils_1.default.trim(this.options.text);
        this.setCurrentText(this.options.text);
        this.initializeCaret();
    }
    return Tiper;
}());
exports.default = Tiper;
//# sourceMappingURL=index.js.map