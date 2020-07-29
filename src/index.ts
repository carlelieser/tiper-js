declare var require: any;

const {
	setIntervalAsync,
	clearIntervalAsync,
} = require("set-interval-async/dynamic");

interface TiperOptions {
	text: string;
	variation?: number;
	wordsPerMinute?: number;
	pauseTimeout?: number;
	pauseOnSpace?: boolean;
	pauseOnEndOfSentence?: boolean;
	showCaret?: boolean;
	glitch?: boolean;
	onFinishedTyping?: Function;
}

class Tiper {
	private element: Element;
	private options: TiperOptions = {
		text:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus sagittis dapibus. Fusce lacinia dui tortor, at porttitor quam luctus ut. Aliquam gravida commodo eros ac dictum. Nam ac odio at sem interdum dictum eget sit amet lorem. Vivamus enim velit, condimentum sed neque non, dignissim viverra nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sodales, neque eget tincidunt efficitur, nisi orci vestibulum diam, eget fringilla dui dolor sed nisi. Pellentesque feugiat augue in felis interdum, non tempus dui volutpat. Sed pulvinar, massa non placerat scelerisque, nunc tellus posuere felis, a ultricies mi libero id velit. Mauris sed arcu dolor. Mauris varius a metus sit amet pulvinar. Proin rhoncus non quam in vulputate. ",
		variation: 0.45,
		wordsPerMinute: 40,
		pauseTimeout: 525,
		pauseOnSpace: false,
		pauseOnEndOfSentence: true,
		showCaret: false,
		glitch: false,
		onFinishedTyping: () => {
			console.log("Finished typing!");
		},
	};

	public typingInterval: number;
	public glitchInterval: number;
	public currentIndex = 0;

	constructor(element: Element, options?: TiperOptions) {
		this.element = element;
		if (options) this.options = { ...this.options, ...options };
		this.options.text = this.options.text.trim();
	}

	public getWords = () => {
		let words = this.options.text.match(/\w+/g);
		return words;
	};

	public getTypingSpeed = () => {
		let ms =
			this.options.text.length / (this.options.wordsPerMinute * 4.7) + 10;
		return ms;
	};

	public updateElementText = (char: string) => {
		let previousTextContent = this.element.textContent;
		let text =
			this.options.text.substring(0, previousTextContent.length) + char;
		let caret = this.options.showCaret ? "▮" : "";
		this.element.textContent = text + caret;
	};

	public stopTyping = () => {
		return clearIntervalAsync(this.typingInterval);
	};

	public handleTypingPause = async () => {
		this.stopTyping();
		await this.delay(this.options.pauseTimeout);
		this.beginTyping();
	};

	public delay = (ms: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	public applyVariation = async () => {
		let timeout = Math.floor(
			this.options.variation *
				Math.random() *
				this.getRandomArbitrary(100, 500)
		);
		await this.delay(timeout);
	};

	public insertNextChar = async () => {
		let currentChar = this.options.text.charAt(this.currentIndex);
		let nextChar = this.options.text.charAt(this.currentIndex + 1);
		let isSpace = currentChar.match(/\s/g);
		let isEndOfSentence =
			(currentChar.match(/[\.\?\!]/g) && !nextChar.match(/[\.\?\!]/g)) ||
			currentChar.match(/\\n/g);
		let shouldPause =
			(this.options.pauseOnSpace && isSpace) ||
			(this.options.pauseOnEndOfSentence && isEndOfSentence);

		this.updateElementText(currentChar);

		if (this.options.variation) await this.applyVariation();

		if (this.currentIndex >= this.options.text.length - 1) {
			if (this.options.onFinishedTyping) this.options.onFinishedTyping();
			await this.stopTyping();
		} else {
			this.currentIndex += 1;

			if (shouldPause) await this.handleTypingPause();
		}
	};

	public getRandomArbitrary = (min, max) => {
		return Math.random() * (max - min) + min;
	};

	public applyGlitch = async () => {
		let text = this.element.textContent;
		let randomCharPosition = this.getRandomArbitrary(1, text.length);
		let beforeChar = text.substring(0, randomCharPosition);
		let afterChar = text.substring(randomCharPosition, text.length);
		let glitch = `${beforeChar}▮ ${afterChar}`;
		this.element.textContent = glitch;
		await this.delay(
			this.options.variation * this.getRandomArbitrary(100, 200)
		);
		this.element.textContent = `${beforeChar}${afterChar}`;
	};

	public beginTyping = () => {
		let ms = this.getTypingSpeed();
		this.typingInterval = setIntervalAsync(this.insertNextChar, ms);
		if (this.options.glitch)
			this.glitchInterval = setIntervalAsync(this.applyGlitch, 5000);
		console.log(
			`Beginning to type at ${this.options.wordsPerMinute} words per minute.`
		);
		console.log("Typing interval is:", ms);
	};
}

export default Tiper;
