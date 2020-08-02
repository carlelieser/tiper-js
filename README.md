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
let Tiper = require('tiper-js');

let tiper = new Tiper(document.querySelector('.tiper-js-container'));

tiper.beginTyping(); //Begins typing with default text and config.
tiper.line('Hello, neighbor!') // Types "Hello, neighbor!". Also uses default config.
```

If you want to have the blinking cursor affect, link the css file in your html file like so:

```html
<link type="text/css" rel="stylesheet" href="./node_modules/tiper-js/lib/tiper-js.css">
```

Checkout the test folder for a basic, viewable example.

### Options
Tiper exposes a minimal, yet fun, set of options to play around with.

- `text: string` (required) - The string of text to be typed.
- `hesitation: number` - A number from 0 to 1. Used as a factor in determining the delay between typing the next character. Default is `0.45`.
- `wordsPerMinute: number`: - A number used to determine typing speed. Default is `40`.
- `pauseTimeout: number`: - The time in ms to pause on certain conditions. Only applies if `pauseOnSpace` or `pauseOnEndOfSentence` is true.
- `pauseOnSpace: boolean`: - Whether or not to pause on spaces. Default is false.
- `pauseOnEndOfSentence: boolean`: - Whether or not to pause at the end of sentences. Default is true.
- `showCaret: boolean`: - Whether or not show caret. Default is false.
- `caretType: string`: - The type of caret to show if `showCaret` is true. Available options are 'normal' or 'underscore'. Default is 'normal'.
- `glitch: boolean`: - Whether or not to show glitch effect intermittently.
- `onFinishedTyping: Function`: - The callback to fire after the text has been typed.

### Methods
- `typer.beginTyping(text: string, reset: boolean)` - Begin typing at the current index. Returns a Promise that resolves when all the text has been typed.
- `typer.stopTyping()` - Stop typing at the current index. Returns a Promise that resolves when async interval is cleared.
- `typer.line(text: string)` - Output a single line of text. Returns a Promise that resolves when the particular text is finished being displayed.
