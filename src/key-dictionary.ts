export interface KeyboardKey {
	primary: string;
	secondary?: string;
	usePrimary?: boolean;
	first?: boolean;
	last?: boolean;
}

export interface KeyboardRow {
	[index: number]: KeyboardKey;
	find: Function;
	findIndex: Function;
	length: number;
}

const Dictionary: Array<KeyboardRow> = [
	[
		{
			primary: "`",
			secondary: "~",
			first: true,
		},
		{
			primary: "1",
			secondary: "!",
		},
		{
			primary: "2",
			secondary: "@",
		},
		{
			primary: "3",
			secondary: "#",
		},
		{
			primary: "4",
			secondary: "$",
		},
		{
			primary: "5",
			secondary: "%",
		},
		{
			primary: "6",
			secondary: "^",
		},
		{
			primary: "7",
			secondary: "&",
		},
		{
			primary: "8",
			secondary: "*",
		},
		{
			primary: "9",
			secondary: "(",
		},
		{
			primary: "0",
			secondary: ")",
		},
		{
			primary: "-",
			secondary: "_",
		},
		{
			primary: "=",
			secondary: "+",
			last: true,
		},
	],
	[
		{
			primary: "	",
			first: true,
		},
		{
			primary: "q",
		},
		{
			primary: "w",
		},
		{
			primary: "e",
		},
		{
			primary: "r",
		},
		{
			primary: "t",
		},
		{
			primary: "y",
		},
		{
			primary: "u",
		},
		{
			primary: "i",
		},
		{
			primary: "o",
		},
		{
			primary: "p",
		},
		{
			primary: "[",
			secondary: "{",
		},
		{
			primary: "]",
			secondary: "}",
		},
		{
			primary: "\\",
			secondary: "|",
			last: true,
		},
	],
	[
		{
			primary: "a",
			first: true,
		},
		{
			primary: "s",
		},
		{
			primary: "d",
		},
		{
			primary: "f",
		},
		{
			primary: "g",
		},
		{
			primary: "h",
		},
		{
			primary: "i",
		},
		{
			primary: "j",
		},
		{
			primary: "k",
		},
		{
			primary: "l",
		},
		{
			primary: ";",
			secondary: ":",
		},
		{
			primary: "'",
			secondary: '"',
		},
		{
			primary: "\n",
			last: true,
		},
	],
	[
		{
			primary: "z",
			first: true,
		},
		{
			primary: "x",
		},
		{
			primary: "c",
		},
		{
			primary: "v",
		},
		{
			primary: "b",
		},
		{
			primary: "n",
		},
		{
			primary: "m",
		},
		{
			primary: ",",
			secondary: "<",
		},
		{
			primary: ".",
			secondary: ">",
		},
		{
			primary: "/",
			secondary: "?",
			last: true,
		},
	],
];

export default Dictionary;
