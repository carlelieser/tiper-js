import { setIntervalAsync,
	clearIntervalAsync, 
	SetIntervalAsyncTimer} from 'set-interval-async/dynamic';
import { getRandomArbitrary, delay } from './util';

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
	private element: Element;
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
	private currentIndex = 0;

	constructor(element: Element, options?: TiperOptions) {
		this.element = element;
		if (options) this.options = { ...this.options, ...options };
		this.options.text = this.options.text.trim();
	}

	private getWords = () => {
		return this.options.text.match(/\w+/g);
	};

	private getTypingSpeed = () => {
		return this.options.text.length / (this.options.wordsPerMinute * 4.7) + 10;
	};

	private getCaretCharacter = () => {
		return this.options.caretType === "normal" ? "▮" : "_";
	};

	private updateElementText = (char: string) => {
		const previousTextContent = this.element.textContent;
		const text =
			this.options.text.substring(
				0,
				previousTextContent.length - (this.options.showCaret ? 1 : 0)
			) + char;
		const caret = this.options.showCaret ? this.getCaretCharacter() : "";
		this.element.textContent = text + caret;
	};

	public stopTyping = () => {
		return clearIntervalAsync(this.typingInterval);
	};

	private handleTypingPause = async () => {
		this.stopTyping();
		await delay(this.options.pauseTimeout);
		this.beginTyping();
	};

	private applyVariation = async () => {
		const timeout = Math.floor(
			this.options.hesitation *
				Math.random() *
				getRandomArbitrary(100, 500)
		);
		await delay(timeout);
	};

	private insertNextChar = async () => {
		const currentChar = this.options.text.charAt(this.currentIndex);
		const nextChar = this.options.text.charAt(this.currentIndex + 1);
		const isWhitespace = /\s/.test(currentChar);
		const isEndOfSentence = 
			(/[\.\?\!]/.test(currentChar) && !/[\.\?\!]/.test(nextChar)) ||
			/\\n/.test(currentChar);
		const shouldPause =
			(this.options.pauseOnSpace && isWhitespace) ||
			(this.options.pauseOnEndOfSentence && isEndOfSentence);

		this.updateElementText(currentChar);

		if (this.options.hesitation) await this.applyVariation();

		if (this.currentIndex >= this.options.text.length - 1) {
			if (this.options.onFinishedTyping) this.options.onFinishedTyping();
			await this.stopTyping();
		} else {
			this.currentIndex += 1;

			if (shouldPause) await this.handleTypingPause();
		}
	};

	private applyGlitch = async () => {
		const text = this.element.textContent;
		const randomCharPosition = getRandomArbitrary(1, text.length);
		const beforeChar = text.substring(0, randomCharPosition);
		const afterChar = text.substring(randomCharPosition, text.length);
		const glitch = `${beforeChar}▮ ${afterChar}`;
		this.element.textContent = glitch;
		await delay(
			this.options.hesitation * getRandomArbitrary(100, 200)
		);
		this.element.textContent = `${beforeChar}${afterChar}`;
	};

	public beginTyping = () => {
		const ms = this.getTypingSpeed();
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
