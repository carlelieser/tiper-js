<p>
<img src="https://raw.githubusercontent.com/carlelieser/tiper-js/master/test/img/logo-black.svg" height="80">
</p>

[![npm version](https://badge.fury.io/js/tiper-js.svg)](https://badge.fury.io/js/tiper-js)

A small library for creating typing animations.

_View a short video demonstration [here](https://github.com/carlelieser/tiper-js/blob/master/test/video/tiper-js-screen-recording.mov?raw=true)._

## Installation

`npm i tiper-js`

## Usage

Initialization is really simple. Just create a new instance of Tiper and pass in a DOM element. The options object is optional.

```javascript
//ES6
import Tiper from "tiper-js";

//ES5
let Tiper = require("tiper-js");

let tiper = new Tiper(document.querySelector(".tiper-js-container"));

tiper.beginTyping(); //Begins typing with default text and config.
tiper.line("Hello, neighbor!"); // Types "Hello, neighbor!". Also uses default config.
```

If you want to have the blinking cursor affect, link the css file in your html file like so:

```html
<link
	type="text/css"
	rel="stylesheet"
	href="./node_modules/tiper-js/lib/tiper-js.css"
/>
```

Checkout the test folder for a basic, viewable example.

### Options

Tiper exposes a minimal, yet fun, set of options to play around with.

-   `text: string` (required) - The string of text to be typed.
-   `hesitation: number` - A number from 0 to 1. Used as a factor in determining the delay between typing the next character. Default is `0.45`.
-   `wordsPerMinute: number`: - A number used to determine typing speed. Default is `40`.
-   `pauseTimeout: number`: - The time in ms to pause on certain conditions. Only applies if `pauseOnSpace` or `pauseOnEndOfSentence` is true.
-   `pauseOnSpace: boolean`: - Whether or not to pause on spaces. Default is false.
-   `pauseOnEndOfSentence: boolean`: - Whether or not to pause at the end of sentences. Default is true.
-   `showCaret: boolean`: - Whether or not show caret. Default is false.
-   `caretType: string`: - The type of caret to show if `showCaret` is true. Available options are 'normal' or 'underscore'. Default is 'normal'.
-   `glitch: boolean`: - Whether or not to show glitch effect intermittently.
-   `onFinishedTyping: Function`: - The callback to fire after the text has been typed.

### Methods

-   `tiper.beginTyping(text: string, reset: boolean)` - Begin typing at the current index. Returns a Promise that resolves when all the text has been typed.
-   `tiper.stopTyping()` or `tiper.pauseTyping()` - Stop typing at the current index. Returns a Promise that resolves when async interval is cleared.
-   `tiper.resumeTyping()` - Resume typing from the current index.
-   `tiper.line(text: string)` - Output a single line of text. Returns a Promise that resolves when the particular text is finished being displayed.
-   `tiper.back(chars: number)` - Removes n amount of characters in sequence. If no number is specified, it will remove characters until there are none left.
-	`tiper.getElementText()` - Returns the text content of the current text element.
-   `tiper.setAccuracy(accuracy: number)` - Modify the current typing accuracy.
-   `tiper.isFinished()` - Returns whether or not Tiper is finished typing.
-   `tiper.clearText()` - Clears all text within the container.
-   `tiper.destroy()` - Stops typing and removes all content inside the main container. Returns false.

### Repeating stuff

Tiper offers 3 main ways of repeating text, each with their own benefits and drawbacks.

Let's start with the core repeat function:

#### `tiper.repeat(repeatAmount: number | string, repeatAction: Function)`

This will repeat a given function n amount of times and will serve as the basis for the next two functions. As an example, let's say you want to type "Hi, I'm Carlos. I am a web developer.", but you're not basic, so you want to spice it up a bit. You can do the following:

```javascript
await tiper.line("Hi, I'm Carlos. I am a ");
tiper.repeat(2, async () => {
	await tiper.line("web developer.");
	await tiper.delay(1000);
	await tiper.back(14);
	await tiper.line("web designer.");
	await tiper.delay(1000);
	await tiper.back(13);
	await tiper.delay(2000);
});
```

This will do exactly what you think it will, but it looks really sloppy, and there's not much room for expansion (what if I want to add "professional cat petter" to the list?). That's where `easyRepeat` comes in.

#### `tiper.easyRepeat(config: repeatConfig)`

This function takes in just one parameter of type `repeatConfig` which looks something like this:

```typescript
interface repeatConfig {
	values?: Array<string>;
	action?: string;
	getValue?: Function;
	repeatAmount: number;
	delay: number;
}
```

For `easyRepeat` in particular, we just need a values array, an action, a repeat amount, and a delay. So, we can do the same thing we did with the `repeat` function in a simpler way:

```javascript
let config = {
	action: "line",
	values: ["web developer.", "web designer.", "professional cat petter."],
	repeatAmount: 2,
	delay: 2000,
};
await tiper.line("Hi, I'm Carlos. I am a");
tiper.easyRepeat(config);
```

Now, what if you really wanted to show off and have Tiper repeat that statement forever except this time your profession was chosen at random? Fear not, `targetRepeat` is on the way!

#### `tiper.targetRepeat(config: repeatConfig)`

At first glance, `easyRepeat` and `targetRepeat` look exactly the same, but theres one key difference. With `targetRepeat` you don't have to specify a values array, you can simply pass in a function that can be called to _get_ a value. Check this out.

```javascript
let config = {
	action: "line",
	getValue: this.getRandomProfession, // where the magic happens
	repeatAmount: "forever",
	delay: 2000
}
await tiper.line("Hi, I'm Carlos. I am a");
tiper.targetRepeat(config);
```

Now every time the `line` function gets called, the return value of `this.getRandomProfession` will be passed in, _forever_. Sweet right?

Hope you guys enjoy!