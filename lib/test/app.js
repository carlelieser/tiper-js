"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
var options = {
    text: "\n\tThis is like one of those scenes in a futuristic sci-fi movie where someone is communicating with the main character through an ominous computer screen. And the person is completely unaware of the context or meaning of the message, but then later finds out it was destined to be. \n\t\n\tLike how awesome would it be if I just did something like...\n\n\tMark. You are the chosen one.\n\n\tMeet @ Starbucks later tho?\n\n\tNah just kidding, (sorry if your name is Mark). Anyway, hope you enjoy tinkering around with this!\n\n\t",
};
var typer = new index_1.default(document.querySelector(".typer-js-container"), options);
typer.beginTyping();
//# sourceMappingURL=app.js.map