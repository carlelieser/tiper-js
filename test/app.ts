let $ = require("jquery");
import Tiper, { tiperOptions } from "../src/index";
import copy from "copy-to-clipboard";
import "bootstrap";

let beautifyJs = require("js-beautify").js;

class TiperPlayground {
	private tiperInstance: any;
	private tiperContainer: Element;
	private actionButton: JQuery;
	private restartButton: JQuery;
	private copyCodeButton: JQuery;
	private clearButton: JQuery;
	private textareaElement: JQuery;
	private statusElement: JQuery;
	private status: string;
	private options: tiperOptions;
	private restarting: boolean;

	private TIPER_STOPPED = "Stopped";
	private TIPER_RUNNING = "Running";
	private TIPER_RESTARTING = "Restarting";
	private TIPER_FINISHED = "Finished";
	private TIPER_CLEARED = "Cleared";

	private TIPER_DEFAULT_TEXT =
		"This is like one of those scenes in a futuristic sci-fi movie where someone is communicating with the main character through an ominous computer screen. And the person is completely unaware of the context or meaning of the message, but then later finds out it was destined to be.\n\nLike how awesome would it be if I just did something like...\n\nMark. You are the chosen one.\n\nMeet @ Starbucks later tho?\n\nNah just kidding, (sorry if your name is Mark). Anyway, hope you enjoy tinkering around with this!";

	private stoppedCircleIcon: string =
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-stop-circle"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>';
	private playIcon: string =
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-power"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>';

	constructor(
		tiperContainer: Element,
		actionButton: JQuery,
		restartButton: JQuery,
		copyCodeButton: JQuery,
		clearButton: JQuery,
		textareaElement: JQuery,
		statusElement: JQuery
	) {
		this.tiperContainer = tiperContainer;
		this.actionButton = actionButton;
		this.restartButton = restartButton;
		this.copyCodeButton = copyCodeButton;
		this.clearButton = clearButton;
		this.textareaElement = textareaElement;
		this.statusElement = statusElement;
	}

	private getCurrentOptions = () => {
		if (this.tiperInstance) return this.tiperInstance.options;
		else return this.constructOptions();
	};

	private generateCode = () => {
		let importStatement = 'import Tiper from "tiper-js";';
		let options: tiperOptions = this.getCurrentOptions();
		options.onFinishedTyping = () => {};
		let optionsStatement = `let options = ${JSON.stringify(options)};`;
		let code = `${importStatement}\n\n${optionsStatement}\nlet tiper = new Tiper(document.querySelector('.tiper-js-container'), options);\ntiper.beginTyping();`;
		let beautifiedCode = beautifyJs(code, { indent_size: 4 });
		return beautifiedCode;
	};

	private copyCode = () => {
		let code = this.generateCode();
		copy(code);
		$(".toast").toast("show");
	};

	private constructOptions = () => {
		let tiperElements = $("*").find("[data-tiper]");
		let options: tiperOptions = {};
		tiperElements.each((index, element) => {
			let currentElement = $(element);
			let isCheckbox = currentElement.is(":checkbox");
			let value = isCheckbox
				? currentElement.prop("checked")
				: currentElement.val();
			let prop = currentElement.data("tiper");
			options[prop] = value;
		});

		options.onFinishedTyping = this.handleFinishedTyping;

		return options;
	};

	private getStatus = () => {
		return this.status;
	};

	private setStatus = (status: string) => {
		console.log("Setting status to:", status);
		this.status = status;
		this.setStatusElementText(status);
		this.setButtonHtmlBasedOnStatus(status);
		this.applyActionBasedOnStatus(status);
	};

	private setButtonHtmlBasedOnStatus = (status: string) => {
		let isRunning = status === this.TIPER_RUNNING;
		let icon = isRunning ? this.stoppedCircleIcon : this.playIcon;
		let text = `<span class="ml-2">${isRunning ? "Stop" : "Run"}</span>`;
		let html: string = `${icon}${text}`;

		this.actionButton.html(html);
	};

	private setStatusElementText = (status: string) => {
		this.statusElement.text(status);
	};

	private setRestarting = (restarting: boolean) => {
		this.restarting = restarting;
	};

	private startTiper = async () => {
		let shouldResumeTyping =
			this.tiperInstance &&
			!this.tiperInstance.isFinished() &&
			!this.restarting &&
			this.tiperInstance.getElementText().length;
		if (shouldResumeTyping) await this.tiperInstance.resumeTyping();
		else await this.restartTiper();
		this.setRestarting(false);
	};

	private stopTiper = async () => {
		if (this.tiperInstance) await this.tiperInstance.pauseTyping();
	};

	private restartTiper = async () => {
		let options = this.constructOptions();
		if (this.tiperInstance) await this.tiperInstance.destroy();
		this.tiperInstance = new Tiper(this.tiperContainer, options);
		this.tiperInstance.beginTyping();
	};

	private clearTiper = async () => {
		if (this.tiperInstance){
			await this.stopTiper();
			 this.tiperInstance.clearText();
		}
	};

	private applyActionBasedOnStatus = async (status: string) => {
		switch (status) {
			case this.TIPER_RUNNING:
				this.hideEmptyState();
				this.startTiper();
				break;
			case this.TIPER_STOPPED:
				this.stopTiper();
				break;
			case this.TIPER_RESTARTING:
				this.setRestarting(true);
				this.setStatus(this.TIPER_RUNNING);
				break;
			case this.TIPER_CLEARED:
				await this.clearTiper();
				this.showEmptyState();
				break;
			case this.TIPER_FINISHED:
				console.log("Typing completed!");
				break;
		}
	};

	private showEmptyState = () => {
		$(".empty-state-container")
			.show()
			.animate({ top: "5%", opacity: 1 }, 200, "linear");
	};

	private hideEmptyState = () => {
		$(".empty-state-container").animate(
			{ top: "6%", opacity: 0 },
			200,
			"linear",
			() => {
				$("empty-state-container").hide();
			}
		);
	};

	private handleToggleStatus = () => {
		let status = this.getStatus();
		let newStatus =
			status === this.TIPER_RUNNING
				? this.TIPER_STOPPED
				: this.TIPER_RUNNING;
		this.setStatus(newStatus);
	};

	private handleFinishedTyping = () => {
		this.setStatus(this.TIPER_FINISHED);
	};

	private handleRestartTyping = () => {
		this.setStatus(this.TIPER_RESTARTING);
	};

	private handleClear = () => {
		this.setStatus(this.TIPER_CLEARED);
	};

	public init = () => {
		this.setStatus(this.TIPER_STOPPED);
		this.textareaElement.val(this.TIPER_DEFAULT_TEXT);
		this.actionButton.click(this.handleToggleStatus);
		this.restartButton.click(this.handleRestartTyping);
		this.copyCodeButton.click(this.copyCode);
		this.clearButton.click(this.handleClear);
		this.showEmptyState();
		$(".toast").toast({ delay: 2000 });
	};
}

$(document).ready(() => {
	let playground = new TiperPlayground(
		$(".tiper-js-container").get(0),
		$(".action-btn"),
		$(".restart-btn"),
		$(".copy-code-btn"),
		$(".clear-btn"),
		$("textarea"),
		$(".status")
	);
	playground.init();
});
