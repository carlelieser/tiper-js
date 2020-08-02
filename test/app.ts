import Tiper from "../lib/index";

let options = {
	text: `
	This is like one of those scenes in a futuristic sci-fi movie where someone is communicating with the main character through an ominous computer screen. And the person is completely unaware of the context or meaning of the message, but then later finds out it was destined to be. 
	
	Like how awesome would it be if I just did something like...

	Mark. You are the chosen one.

	Meet @ Starbucks later tho?

	Nah just kidding, (sorry if your name is Mark). Anyway, hope you enjoy tinkering around with this!

	`,
	showCaret: true,
	caretType: 'normal'
};
let typer = new Tiper(document.querySelector(".typer-js-container"), options);
typer.line('Cared season.').then(() => {
	typer.line('Ooof.');
});