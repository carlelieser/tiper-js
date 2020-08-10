import {
	setIntervalAsync,
	clearIntervalAsync,
} from "set-interval-async/dynamic";

import ClosestKey from "./closest-key";
import Utils from "./utils";

export interface tiperOptions {
	text?: string;
	hesitation?: number;
	accuracy?: number;
	wordsPerMinute?: number;
	pauseTimeout?: number;
	pauseOnSpace?: boolean;
	pauseOnEndOfSentence?: boolean;
	showCaret?: boolean;
	caretType?: string;
	glitch?: boolean;
	onFinishedTyping?: Function;
}

export interface repeatConfig {
	values?: Array<string>;
	action?: string;
	getValue?: Function;
	repeatAmount: number;
	delay: number;
}

class Tiper {
	private container: Element;
	private caretElement: Element;
	private options: tiperOptions = {
		text:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus sagittis dapibus. Fusce lacinia dui tortor, at porttitor quam luctus ut. Aliquam gravida commodo eros ac dictum. Nam ac odio at sem interdum dictum eget sit amet lorem. Vivamus enim velit, condimentum sed neque non, dignissim viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sodales, neque eget tincidunt efficitur, nisi orci vestibulum diam, eget fringilla dui dolor sed nisi. Pellentesque feugiat augue in felis interdum, non tempus dui volutpat. Sed pulvinar, massa non placerat scelerisque, nunc tellus posuere felis, a ultricies mi libero id velit. Mauris sed arcu dolor. Mauris varius a metus sit amet pulvinar. Proin rhoncus non quam in vulputate. ",
		hesitation: 0.45,
		accuracy: 0.95,
		wordsPerMinute: 40,
		pauseTimeout: 525,
		pauseOnSpace: false,
		pauseOnEndOfSentence: true,
		showCaret: false,
		caretType: "normal",
		glitch: false,
		onFinishedTyping: () => {
			console.log("Finished typing!");
		},
	};

	private typingInterval: number;
	private glitchInterval: number;
	private currentTextElement: any;
	private currentTypos: string;
	private currentText: string;
	private currentIndex: number = 0;
	private charsToDelete: number = 0;

	private repeatAmount: number = 0;
	private repeatAction: Function;
	private repeatValue: Function;

	private mandatoryStop: boolean = false;

	private typingListener = {
		finishedTyping: false,
		finishedTypingListener: function (val) {},
		get isFinishedTyping() {
			return this.finishedTyping;
		},
		set isFinishedTyping(finishedTyping: boolean) {
			this.finishedTyping = finishedTyping;
			this.finishedTypingListener(finishedTyping);
		},
		registerListener: function (listener) {
			this.finishedTypingListener = listener;
		},
	};

	constructor(container: Element, options?: tiperOptions) {
		this.container = container;
		if (this.container === null)
			this.throwError("Invalid container element.");
		if (options) this.options = { ...this.options, ...options };
		this.options.text = Utils.trim(this.options.text);
		this.setCurrentText(this.options.text);
		this.initializeCaret();
	}

	private throwError = (message: string) => {
		throw new Error(`tiper-js: ${message}`);
	};

	private setRepeatSettings = (
		repeatAmount: number,
		repeatAction: Function
	) => {
		this.repeatAmount = repeatAmount;
		this.repeatAction = repeatAction;

		if (this.repeatAmount) this.options.accuracy = 1;
	};

	private setMandatoryStop = (mandatoryStop: boolean) => {
		this.mandatoryStop = mandatoryStop;
	};

	private setCharsToDelete = (charsToDelete: number) => {
		if (
			(this.charsToDelete == 1 && charsToDelete === 0) ||
			charsToDelete <= 0
		) {
			this.setFinishedTyping(true);
			this.stopTyping(false);
		}
		this.charsToDelete = charsToDelete;
	};

	private setRepeatValue = (getValue: Function) => {
		this.repeatValue = getValue;
	};

	private getWords = () => {
		let words = this.getCurrentText().match(/\w+/g);
		return words;
	};

	private getAverageWordLength = () => {
		let wordLengths: Array<number> = [];
		let words = this.getWords();
		for (let i = 0; i < words.length; i++) {
			let word = words[i];
			wordLengths.push(word.length);
		}

		let sum = wordLengths.reduce(
			(previous, current) => (current += previous)
		);
		let avg = sum / wordLengths.length;
		return avg;
	};

	private getTypingSpeed = () => {
		let avg = this.getAverageWordLength();
		let ms = Math.abs(Math.floor(
			((60 / this.options.wordsPerMinute) * (1 / avg) * 1000) / 4
		) - 20);
		let normalized = ms < 10 ? 10 : ms;
		return normalized;
	};

	private getCaretCharacter = () => {
		let char = this.options.caretType === "normal" ? "▮" : "_";
		return char;
	};

	private generateArrayWithSameValues = (value: string, length: number) => {
		let arr: Array<string> = new Array();
		for (let j = 0; j < length; j++) {
			arr[j] = value;
		}
		return arr;
	};

	private generateBinaryTypoMap = () => {
		let totalChars = this.currentText.length;
		if (this.options.accuracy === 1)
			return this.generateArrayWithSameValues("1", totalChars);

		let percentageAccurate = this.options.accuracy * 100;
		let correctChars = Math.floor((totalChars / 100) * percentageAccurate);
		let wrongChars = Math.floor((totalChars - correctChars) / 2);
		let diff = totalChars - wrongChars;
		correctChars = correctChars + diff;

		let correctMap = this.generateArrayWithSameValues("1", correctChars);
		let incorrectMap = this.generateArrayWithSameValues("0", wrongChars);
		let unshuffledBinaryMap = [...correctMap, ...incorrectMap];
		let binaryMap = Utils.shuffleArray(unshuffledBinaryMap);
		return binaryMap;
	};

	private getClosestKey = (key: string) => {
		let closestKey = new ClosestKey();
		let keyboardKey: any = closestKey.find(key);
		return keyboardKey;
	};

	private generateTypos = () => {
		let typos: string = this.generateBinaryTypoMap().join("");
		return typos;
	};

	private setCurrentTypos = (typos: string) => {
		this.currentTypos = typos;
	};

	private updateTypos = () => {
		let typos = this.generateTypos();
		this.setCurrentTypos(typos);
	};

	private setCurrentText = (text: string) => {
		this.currentText = text;
		this.setCurrentIndex(0);
		this.updateTypos();
	};

	private setCurrentTextElement = (currentTextElement: any) => {
		this.currentTextElement = currentTextElement;
	};

	private setCurrentIndex = (index: number) => {
		this.currentIndex = index;
	};

	private getCurrentText = () => {
		return this.currentText;
	};

	private getTextByRange = (
		start: number,
		end: number,
		useOriginal?: boolean
	) => {
		let text = useOriginal ? this.getCurrentText() : this.getElementText();
		let str = text.substring(start, end);
		return str;
	};

	private getCaretLength = () => {
		let caretLength = this.options.showCaret ? 1 : 0;
		return caretLength;
	};

	private sourceTextIsTargetLength = () => {
		if (!this.currentTextElement) return;
		let caretLength = this.getCaretLength();
		let textContentLength =
			this.currentTextElement.textContent.length - caretLength;
		let currentTextLength = this.currentText.length - 1;
		return textContentLength >= currentTextLength;
	};

	private observeTyping = () => {
		return new Promise((resolve, reject) => {
			this.typingListener.registerListener((isFinished: boolean) => {
				if (isFinished) resolve();
			});
		});
	};

	private setFinishedTyping = (finishedTyping: boolean) => {
		this.typingListener.isFinishedTyping = finishedTyping;
	};

	private resetFinishedTyping = () => {
		this.setFinishedTyping(false);
	};

	private updateElementText = (char: string, reverse?: boolean) => {
		let previousTextContent = this.currentTextElement.textContent;
		let lastIndex = previousTextContent.length;
		let text = reverse
			? this.getTextByRange(0, lastIndex - 1)
			: this.getTextByRange(0, lastIndex) + char;
		this.setElementText(text);
	};

	public stopTyping = async (mandatory: boolean = true) => {
		if (!this.mandatoryStop) this.setMandatoryStop(mandatory);
		this.activateCaret();
		this.setFinishedTyping(true);
		await clearIntervalAsync(this.typingInterval);
	};

	public pause = async (ms?: number, mandatoryStop: boolean = false) => {
		let timeOut = typeof ms === "number" ? ms : this.options.pauseTimeout;
		await this.stopTyping(mandatoryStop);
		await this.delay(timeOut);
	};

	public pauseTyping = () => {
		return this.pause(null, true);
	};

	public resume = (
		reverse?: boolean,
		reset?: boolean,
		mandatoryStop?: boolean,
		setMandatoryStop?: boolean
	) => {
		if (setMandatoryStop) this.setMandatoryStop(mandatoryStop);
		if (this.mandatoryStop) return;
		this.setMandatoryStop(mandatoryStop);
		if (reset) this.resetFinishedTyping();
		this.initializeTypingInterval(reverse);
		this.deactivateCaret();
	};

	public resumeTyping = () => {
		return this.resume(false, true, false, true);
	};

	private delay = (ms: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	private applyVariation = async () => {
		let timeout = Math.ceil(
			Math.floor(
				this.options.hesitation *
					Math.random() *
					Utils.getRandomArbitrary(20, 300)
			)
		);
		await this.delay(timeout);
	};

	private getCharAt = (index: number) => {
		let text = this.currentText;
		let char = text.charAt(index);
		return char;
	};

	private isEndOfSentence = (currentChar: string, nextChar: string) => {
		let isEndOfSentence =
			(currentChar.match(/[\.\?\!]/g) && !nextChar.match(/[\.\?\!]/g)) ||
			currentChar.match(/\\n/g);
		return isEndOfSentence;
	};

	private getShouldPause = (currentChar: string, nextChar: string) => {
		let isSpace = currentChar.match(/\s/g);
		let isEndOfSentence = this.isEndOfSentence(currentChar, nextChar);

		let shouldPause =
			(this.options.pauseOnSpace && isSpace) ||
			(this.options.pauseOnEndOfSentence && isEndOfSentence);

		return shouldPause;
	};

	private fixTypoAtIndex = (index: number) => {
		let typosCopy: string = this.currentTypos.slice(0);
		let typosArray = typosCopy.split("");
		typosArray.splice(index, 1, "1");
		typosCopy = typosArray.join("");
		this.setCurrentTypos(typosCopy);
	};

	private applyAndCorrectTypo = async () => {
		let spaces = Utils.getRandomArbitrary(1, 3);
		let thinkingTime = Utils.getRandomArbitrary(50, 300);
		await this.applyVariation();
		await this.back(spaces);
		await this.applyVariation();
		await this.delay(thinkingTime);

		this.fixTypoAtIndex(this.currentIndex + spaces);
		this.resume(false, true);
	};

	private insertCurrentChar = async (reverse?: boolean) => {
		if (!this.currentTextElement) this.initializeTextElement();
		if (!this.typingListener.isFinishedTyping && !this.mandatoryStop) {
			let currentChar = this.getCharAt(this.currentIndex);
			let nextChar = this.getCharAt(this.currentIndex + 1);
			let shouldPause = this.getShouldPause(currentChar, nextChar);
			let isFinished =
				this.typingListener.isFinishedTyping ||
				this.sourceTextIsTargetLength();
			let shouldBeTypo =
				this.currentTypos.charAt(this.currentIndex) === "0";

			let finalChar = shouldBeTypo
				? this.getClosestKey(currentChar)
				: currentChar;

			this.updateElementText(finalChar, reverse);

			if (this.options.hesitation) await this.applyVariation();

			if (shouldBeTypo && !reverse) await this.applyAndCorrectTypo();

			if (isFinished && !reverse && !shouldBeTypo) {
				if (this.options.onFinishedTyping)
					this.options.onFinishedTyping();
				this.setFinishedTyping(true);
				await this.stopTyping();
			} else {
				this.setCurrentIndex(this.currentIndex + (reverse ? -1 : 1));

				if (reverse) this.setCharsToDelete(this.charsToDelete - 1);
				if (shouldPause && (reverse ? this.charsToDelete > 0 : true)) {
					await this.pause();
					this.resume(reverse, true, false);
				}
			}
		} else {
			await this.stopTyping(true);
		}
	};

	private setCaretElement = (caretElement: any) => {
		this.caretElement = caretElement;
	};

	private activateCaret = () => {
		if (this.caretElement) this.caretElement.classList.add("blinking");
	};

	private deactivateCaret = () => {
		if (this.caretElement) this.caretElement.classList.remove("blinking");
	};

	private createSpan = (className: string) => {
		let el = document.createElement("span");
		el.className = className;
		return el;
	};

	private removeAllElements = (element: Element) => {
		let allElements = document.getElementsByClassName(element.className);
		for (let i = 0; i < allElements.length; i++) {
			let el = allElements[i];
			el.remove();
		}
	};

	private insertElementInContainer = (
		element: Element,
		prepend?: boolean
	) => {
		this.removeAllElements(element);
		let action = prepend ? "prepend" : "appendChild";
		this.container[action](element);
	};

	private initializeTextElement = () => {
		let textElement = this.createSpan("tiper-js-text");
		this.insertElementInContainer(textElement, true);
		this.setCurrentTextElement(textElement);
	};

	private initializeCaret = () => {
		if (this.options.showCaret) {
			if (this.caretElement) this.caretElement.remove();
			let caret = this.createSpan("tiper-js-caret");
			caret.innerText = this.getCaretCharacter();
			this.insertElementInContainer(caret);
			this.setCaretElement(caret);
			this.activateCaret();
		}
	};

	private initializeGlitchEffect = async () => {
		if (this.glitchInterval) await clearIntervalAsync(this.glitchInterval);
		let ms = Utils.getRandomArbitrary(50, 2000);
		this.glitchInterval = setIntervalAsync(this.applyGlitch, ms);
		console.log(
			`Beginning to type at ${this.options.wordsPerMinute} words per minute.`
		);
	};

	private initializeTypingInterval = (reverse?: boolean) => {
		let ms = this.getTypingSpeed();
		this.typingInterval = setIntervalAsync(
			() => this.insertCurrentChar(reverse),
			ms
		);
		console.log("Typing interval is:", ms);
	};

	private setElementText = (text: string) => {
		this.currentTextElement.textContent = text;
	};

	public getElementText = () => {
		if (this.currentTextElement) return this.currentTextElement.textContent;
		return "";
	};

	private resetElementText = () => {
		this.container.innerHTML = "";
		this.setCurrentIndex(0);
		this.setCurrentTextElement(false);
		this.setFinishedTyping(false);
		this.initializeCaret();
	};

	private getRandomGlitchChar = () => {
		let index = Utils.getRandomArbitrary(128, 254);
		let char = String.fromCharCode(index);
		return char;
	};

	private generateGlitchText = () => {
		let text = this.getElementText();
		let textArray = text.split("");

		for (let i = 0; i < textArray.length / 2; i++) {
			let randomIndex = Utils.getRandomArbitrary(0, textArray.length);
			let glitch = this.getRandomGlitchChar();
			textArray.splice(randomIndex, 1, glitch);
		}

		let glitchText = textArray.join("");
		return glitchText;
	};

	private applyGlitch = async () => {
		let glitchText = this.generateGlitchText();
		let showTime =
			this.options.hesitation * Utils.getRandomArbitrary(100, 2000);
		this.setElementText(glitchText);
		await this.delay(showTime);

		let originalText = this.getTextByRange(0, this.currentIndex, true);
		this.setElementText(originalText);

		this.initializeGlitchEffect();
	};

	public beginTyping = async (text?: string, reset?: boolean) => {
		let currentText = text ? text : this.options.text;
		if (reset) this.resetElementText();
		this.initializeTextElement();
		this.setCurrentText(currentText);
		this.resetFinishedTyping();
		this.setMandatoryStop(false);
		this.initializeTypingInterval();
		if (this.options.glitch) this.initializeGlitchEffect();
		if (this.options.showCaret) this.initializeCaret();
		this.deactivateCaret();

		await this.observeTyping();
	};

	public line = async (text: string, reset?: boolean) => {
		if (reset) this.resetElementText();
		await this.beginTyping(text);
	};

	public back = async (chars: number = this.getElementText().length) => {
		await this.stopTyping(false);
		this.resetFinishedTyping();
		this.setCharsToDelete(chars);
		this.initializeTypingInterval(true);

		await this.observeTyping();
	};

	public repeat = async (
		repeatAmount: number | string,
		repeatAction: Function
	) => {
		let shouldRepeatForever = repeatAmount === "forever";
		let timesToRepeat: any = shouldRepeatForever ? Infinity : repeatAmount;
		this.setRepeatSettings(timesToRepeat, repeatAction);
		if (this.repeatAmount > 0) {
			await repeatAction();
			await this.continueRepeat();
		}
	};

	private continueRepeat = async () => {
		await this.repeat(this.repeatAmount - 1, this.repeatAction);
	};

	private generateRepeatAction = (
		action: string,
		delay: number = 2000,
		fixedValue?: string,
		returnAsync: boolean = true
	) => {
		let actionString = `${returnAsync ? "async () => {" : ""}\n${
			fixedValue ? "" : "let value = this.repeatValue();"
		}\nawait this['${action}'](${
			fixedValue ? `\`${fixedValue}\`` : "value"
		});\nawait this.delay(1000);\nawait this.back(${
			fixedValue ? fixedValue.length : "value.length"
		});\nawait this.delay(${delay});\n${returnAsync ? "}" : ""}`;
		return actionString;
	};

	public easyRepeat = async (config: repeatConfig) => {
		let sanitizedArray = config.values.map((text) =>
			this.generateRepeatAction(config.action, config.delay, text, false)
		);
		let asyncFunctionString = `async () => {${sanitizedArray.join("\n")}}`;
		return this.repeat(config.repeatAmount, eval(asyncFunctionString));
	};

	public targetRepeat = async (config: repeatConfig) => {
		let { action, getValue, repeatAmount, delay } = config;
		this.setRepeatValue(getValue);
		let asyncFunctionString = this.generateRepeatAction(action, delay);
		return this.repeat(repeatAmount, eval(asyncFunctionString));
	};

	public setAccuracy = (accuracy: number) => {
		this.options.accuracy = accuracy;
	};

	public destroy = async () => {
		await this.stopTyping(true);
		this.resetElementText();
		return false;
	};

	public isFinished = () => {
		return this.sourceTextIsTargetLength();
	};

	public clearText = this.resetElementText;
}

export default Tiper;
