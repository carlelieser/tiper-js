declare var require: any;

const {
	setIntervalAsync,
	clearIntervalAsync,
} = require("set-interval-async/dynamic");

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

	private typingInterval: number;
	private glitchInterval: number;
	private currentTextElement: Element;
	private currentText: string;
	private currentIndex = 0;

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

	constructor(container: Element, options?: TiperOptions) {
		this.container = container;
		if (options) this.options = { ...this.options, ...options };
		this.options.text = this.trim(this.options.text);
		this.setCurrentText(this.options.text);
	}

	private trim = (str: string) => {
		return str.trim();
	};

	private getTypingSpeed = () => {
		let ms =
			this.currentText.length / (this.options.wordsPerMinute * 4.7) + 10;
		return ms;
	};

	private getCaretCharacter = () => {
		let char = this.options.caretType === "normal" ? "▮" : "_";
		return char;
	};

	private setCurrentText = (text: string) => {
		this.currentText = text;
		this.currentIndex = 0;
		console.log("Setting current text to:", text);
	};

	private getCurrentText = () => {
		return this.currentText;
	};

	private getTextByRange = (start: number, end: number) => {
		let text = this.getCurrentText();
		let str = text.substring(start, end);
		return str;
	};

	private getCaretLength = () => {
		let caretLength = this.options.showCaret ? 1 : 0;
		return caretLength;
	};

	private sourceTextIsTargetLength = () => {
		let caretLength = this.getCaretLength();
		let textContentLength = this.container.textContent.length - caretLength;
		let currentTextLength = this.currentText.length - 1;

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

	private updateElementText = (char: string) => {
		let previousTextContent = this.container.textContent;
		let caretLength = this.getCaretLength();
		let lastIndex = previousTextContent.length - caretLength;
		let text = this.getTextByRange(0, lastIndex) + char;
		let caret = this.options.showCaret ? this.getCaretCharacter() : "";
		this.container.textContent = text + caret;
	};

	public stopTyping = () => {
		return clearIntervalAsync(this.typingInterval);
	};

	private pauseTyping = async (ms?: number) => {
		let timeOut = ms !== undefined ? ms : this.options.pauseTimeout;
		this.stopTyping();
		await this.delay(timeOut);
		this.beginTyping();
	};

	private delay = (ms: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	private applyVariation = async () => {
		let timeout = Math.floor(
			this.options.hesitation *
				Math.random() *
				this.getRandomArbitrary(100, 500)
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

	private insertCurrentChar = async () => {
		let currentChar = this.getCharAt(this.currentIndex);
		let nextChar = this.getCharAt(this.currentIndex + 1);
		let shouldPause = this.getShouldPause(currentChar, nextChar);
		let isFinished = this.sourceTextIsTargetLength();
		this.updateElementText(currentChar);

		if (this.options.hesitation) await this.applyVariation();

		if (isFinished) {
			if (this.options.onFinishedTyping) this.options.onFinishedTyping();
			this.typingListener.isFinishedTyping = true;
			await this.stopTyping();
		} else {
			this.currentIndex += 1;
			if (shouldPause) await this.pauseTyping();
		}
	};

	private getRandomArbitrary = (min, max) => {
		return Math.random() * (max - min) + min;
	};

	private setElementText = (text: string) => {
		this.container.textContent = text;
	};

	private resetElementText = () => {
		this.setElementText('');
	}

	private applyGlitch = async () => {
		let text = this.container.textContent;
		let randomCharPosition = this.getRandomArbitrary(1, text.length);
		let beforeChar = text.substring(0, randomCharPosition);
		let afterChar = text.substring(randomCharPosition, text.length);
		let glitch = `${beforeChar}▮ ${afterChar}`;
		this.setElementText(glitch);
		await this.delay(
			this.options.hesitation * this.getRandomArbitrary(100, 200)
		);
		this.setElementText(`${beforeChar}${afterChar}`);
	};

	public beginTyping = async (text?: string, reset?: boolean) => {
		let ms = this.getTypingSpeed();
		let currentText = text ? text : this.options.text;
		if (reset) this.resetElementText();
		this.setCurrentText(currentText);
		this.typingListener.isFinishedTyping = false;
		this.typingInterval = setIntervalAsync(this.insertCurrentChar, ms);
		if (this.options.glitch)
			this.glitchInterval = setIntervalAsync(this.applyGlitch, 5000);
		console.log(
			`Beginning to type at ${this.options.wordsPerMinute} words per minute.`
		);
		console.log("Typing interval is:", ms);

		await this.observeTyping();
	};

	public line = (text: string) => {
		return this.beginTyping(text);
	};
}

declare global {
	interface Window {
		Tiper: any;
	}
}

window.Tiper = Tiper;

export default Tiper;
