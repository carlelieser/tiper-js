<p>
<img src="https://raw.githubusercontent.com/carlelieser/tiper-js/master/test/img/logo-black.svg" height="80">
</p>
A small library for creating typing animations.

## Usage
Initialization is really simple. Just create a new instance of Tiper and pass in a DOM element. The options object is optional.

```javascript
let typer = new Tiper(document.querySelector('.typer-js-container'));
typer.beginTyping();
```

### Options
Tiper exposes a minimal, yet fun, set of options to play around with.

- `text: string` - The string of text to be typed.
- `variation: number` (optional) - A number from 0 to 1. Used as a factor in determining the delay between typing the next character. Default is `0.45`.
- `wordsPerMinute: number`: (optional) - A number used to determine typing speed. Default is `40`.
- `pauseTimeout: number`: (optional) - The time in ms to pause on certain conditions. Only applies if `pauseOnSpace` or `pauseOnEndOfSentence` is true.
- `pauseOnSpace: boolean`: (optional) - Whether or not to pause on spaces. Default is false.
- `pauseOnEndOfSentence: boolean`: (optional) - Whether or not to pause at the end of sentences. Default is true.
- `showCaret: boolean`: (optional) - Whether or not show caret. Default is false.
- `glitch: boolean`: (optional) - Whether or not to show glitch effect intermittently.
- `onFinishedTyping: Function`: (optional) - The callback to fire after the text has been typed.
