import {
	setIntervalAsync,
	clearIntervalAsync,
	SetIntervalAsyncTimer
} from "set-interval-async/dynamic";

import { getRandomArbitrary, createSpan, delay } from './util';

interface TiperOptions {
	text: string;
	hesitation?: number;
	wordsPerMinute?: number;
	pauseTimeout?: number;
	pauseOnSpace?: boolean;
	pauseOnEndOfSentence?: boolean;
	showCaret?: boolean;
	caretType?: string;
	glitch?: boolean;
	onFinishedTyping?: Function;
}

class Tiper {
	private container: Element;
	private caretElement: Element;
	private options: TiperOptions = {
		text:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus sagittis dapibus. Fusce lacinia dui tortor, at porttitor quam luctus ut. Aliquam gravida commodo eros ac dictum. Nam ac odio at sem interdum dictum eget sit amet lorem. Vivamus enim velit, condimentum sed neque non, dignissim viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sodales, neque eget tincidunt efficitur, nisi orci vestibulum diam, eget fringilla dui dolor sed nisi. Pellentesque feugiat augue in felis interdum, non tempus dui volutpat. Sed pulvinar, massa non placerat scelerisque, nunc tellus posuere felis, a ultricies mi libero id velit. Mauris sed arcu dolor. Mauris varius a metus sit amet pulvinar. Proin rhoncus non quam in vulputate. ",
		hesitation: 0.45,
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

	private typingInterval: SetIntervalAsyncTimer;
	private glitchInterval: SetIntervalAsyncTimer;
	private currentTextElement: Element;
	private currentText: string;
	private currentIndex = 0;

	private typingListener = {
		finishedTyping: false,
		finishedTypingListener: function (_) {},
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

	constructor(container: Element, options?: TiperOptions) {
		this.container = container;
		if (this.container === null)
			throw new Error("tiper-js: Invalid container element.");
		if (options) this.options = { ...this.options, ...options };
		this.options.text = this.trim(this.options.text);
		this.setCurrentText(this.options.text);
	}

	private trim = (str: string) => {
		return str.trim();
	};

	private getTypingSpeed = () => {
		return this.currentText.length / (this.options.wordsPerMinute * 4.7) + 10;
	};

	private getCaretCharacter = () => {
		return this.options.caretType === "normal" ? "▮" : "_";
	};

	private setCurrentText = (text: string) => {
		this.currentText = text;
		this.currentIndex = 0;
		console.log("Setting current text to:", text);
	};

	private setCurrentTextElement = (currentTextElement: Element) => {
		this.currentTextElement = currentTextElement;
	};

	private getCurrentText = () => {
		return this.currentText;
	};

	private getTextByRange = (start: number, end: number) => {
		const text = this.getCurrentText();
		const str = text.substring(start, end);
		return str;
	};

	private getCaretLength = () => {
		return this.options.showCaret ? 1 : 0;
	};

	private sourceTextIsTargetLength = () => {
		const caretLength = this.getCaretLength();
		const textContentLength =
			this.currentTextElement.textContent.length - caretLength;
		const currentTextLength = this.currentText.length - 1;

		console.log(
			"Current text length vs actual container text length:",
			currentTextLength,
			textContentLength
		);

		return textContentLength == currentTextLength;
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

	private updateElementText = (char: string) => {
		const previousTextContent = this.currentTextElement.textContent;
		const lastIndex = previousTextContent.length;
		const text = this.getTextByRange(0, lastIndex) + char;
		this.currentTextElement.textContent = text;
	};

	public stopTyping = () => {
		this.activateCaret();
		return clearIntervalAsync(this.typingInterval);
	};

	private pauseTyping = async (ms?: number) => {
		const timeOut = ms ?? this.options.pauseTimeout;
		this.stopTyping();
		await delay(timeOut);
		this.resumeTyping();
	};

	private resumeTyping = () => {
		this.initializeTypingInterval();
		this.deactivateCaret();
	};

	private applyVariation = async () => {
		const timeout = Math.floor(
			this.options.hesitation *
				Math.random() *
				getRandomArbitrary(100, 500)
		);
		await delay(timeout);
	};

	private getCharAt = (index: number) => {
		const text = this.currentText;
		const char = text.charAt(index);
		return char;
	};

	private isEndOfSentence = (currentChar: string, nextChar: string) => {
		const isEndOfSentence =
			(/[\.\?\!]/.test(currentChar) && !/[\.\?\!]/.test(nextChar)) ||
			/\\n/.test(currentChar);
		return isEndOfSentence;
	};

	private getShouldPause = (currentChar: string, nextChar: string) => {
		const isSpace = /\s/.test(currentChar);
		const isEndOfSentence = this.isEndOfSentence(currentChar, nextChar);

		const shouldPause =
			(this.options.pauseOnSpace && isSpace) ||
			(this.options.pauseOnEndOfSentence && isEndOfSentence);

		return shouldPause;
	};

	private insertCurrentChar = async () => {
		const currentChar = this.getCharAt(this.currentIndex);
		const nextChar = this.getCharAt(this.currentIndex + 1);
		const shouldPause = this.getShouldPause(currentChar, nextChar);
		const isFinished = this.sourceTextIsTargetLength();
		this.updateElementText(currentChar);

		if (this.options.hesitation) await this.applyVariation();

		if (isFinished) {
			if (this.options.onFinishedTyping) this.options.onFinishedTyping();
			this.setFinishedTyping(true);
			await this.stopTyping();
		} else {
			this.currentIndex += 1;
			if (shouldPause) await this.pauseTyping();
		}
	};

	private activateCaret = () => {
		if (this.caretElement) this.caretElement.classList.add("blinking");
	};

	private deactivateCaret = () => {
		if (this.caretElement) this.caretElement.classList.remove("blinking");
	};

	private appendElementToContainer = (element: Element) => {
		this.container.appendChild(element);
	};

	private initializeTextElement = () => {
		const textElement = createSpan("tiper-js-text");
		this.appendElementToContainer(textElement);
		this.setCurrentTextElement(textElement);
	};

	private initializeCaret = () => {
		if (this.caretElement) this.caretElement.remove();
		const caret = createSpan("tiper-js-caret");
		caret.innerText = this.getCaretCharacter();
		this.appendElementToContainer(caret);
		this.caretElement = caret;
		this.activateCaret();
	};

	private initializeGlitchEffect = () => {
		this.glitchInterval = setIntervalAsync(this.applyGlitch, 5000);
		console.log(
			`Beginning to type at ${this.options.wordsPerMinute} words per minute.`
		);
	};

	private initializeTypingInterval = () => {
		const ms = this.getTypingSpeed();
		this.typingInterval = setIntervalAsync(this.insertCurrentChar, ms);
		console.log("Typing interval is:", ms);
	};

	private setElementText = (text: string) => {
		this.currentTextElement.textContent = text;
	};

	private resetElementText = () => {
		this.container.innerHTML = "";
	};

	private applyGlitch = async () => {
		const text = this.container.textContent;
		const randomCharPosition = getRandomArbitrary(1, text.length);
		const beforeChar = text.substring(0, randomCharPosition);
		const afterChar = text.substring(randomCharPosition, text.length);
		const glitch = `${beforeChar}▮ ${afterChar}`;
		this.setElementText(glitch);
		await delay(
			this.options.hesitation * getRandomArbitrary(100, 200)
		);
		this.setElementText(`${beforeChar}${afterChar}`);
	};

	public beginTyping = async (text?: string, reset?: boolean) => {
		const currentText = text || this.options.text;
		if (reset) this.resetElementText();
		this.initializeTextElement();
		this.setCurrentText(currentText);
		this.resetFinishedTyping();
		this.initializeTypingInterval();
		if (this.options.glitch) this.initializeGlitchEffect();
		if (this.options.showCaret) this.initializeCaret();
		this.deactivateCaret();

		await this.observeTyping();
	};

	public line = async (text: string) => {
		await this.beginTyping(text);
		return this;
	};
}

export default Tiper;
