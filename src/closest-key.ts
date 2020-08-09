import Utils from "./utils";
import Dictionary, { KeyboardRow, KeyboardKey } from "./key-dictionary";

interface QueryData {
	row?: number;
	key?: number;
	rowData?: KeyboardRow | boolean;
	keyData?: KeyboardKey | boolean;
	isFound?: boolean;
}

interface DictionaryLocation {
	row?: number;
	key?: number;
	rowExists?: boolean;
}

class ClosestKey {
	private dictionary: KeyboardRow[];

	constructor() {
		this.dictionary = Dictionary;
	}

	private getRow = (index: number) => {
		if (index > this.dictionary.length - 1 || index < 0)
			throw new Error(`Object at index ${index} not found.`);
		return this.dictionary[index];
	};

	private getKeyboardKey = (rowIndex: number, keyIndex: number) => {
		let rowData = this.getRow(rowIndex);
		let keyData: KeyboardKey = rowData[keyIndex];
		return keyData;
	};

	private getKeyShift = (rowIndex: number, keyIndex: number) => {
		let keyboardRow: KeyboardRow = this.getRow(rowIndex);
		let charsLeft = keyboardRow.length - 1 - keyIndex;
		let end = charsLeft > 2 ? 2 : charsLeft;
		let shift = Utils.getRandomArbitrary(1, end);

		return shift;
	};

	private getCorrectArithmetic = (
		key: KeyboardKey,
		keyIndex: number,
		shift: number,
		rowLength: number
	) => {
		let shouldSubtract = key.last || keyIndex + shift >= rowLength;
		let mathSign: string = shouldSubtract ? "-" : "+";

		return mathSign;
	};

	private getRandomLetter = () => {
		let alphabet = "abcdefghijklmnopqrstuvwxyz";
		let index = Utils.getRandomArbitrary(0, alphabet.length - 1);
		let letter = alphabet.charAt(index);
		return letter;
	};

	private getClosestKeyIndex = (rowIndex: number, keyIndex: number) => {
		let keyboardRow = this.getRow(rowIndex);
		let keyboardKey = this.getKeyboardKey(rowIndex, keyIndex);
		let shift = this.getKeyShift(rowIndex, keyIndex);
		let arithmetic = this.getCorrectArithmetic(
			keyboardKey,
			keyIndex,
			shift,
			keyboardRow.length
		);
		let index = eval(`${keyIndex} ${arithmetic} ${shift}`);

		return index;
	};

	private getClosestKey = (rowIndex: number, keyIndex: number) => {
		let keyboardRow: KeyboardRow = this.getRow(rowIndex);
		let currentKey: KeyboardKey = this.getKeyboardKey(rowIndex, keyIndex);
		let newKeyIndex = this.getClosestKeyIndex(rowIndex, keyIndex);
		let closestKey: any = keyboardRow[newKeyIndex];

		if (currentKey.usePrimary) closestKey = closestKey.primary;
		else closestKey = closestKey.secondary;

		return closestKey;
	};

	public getDictionaryLocation = (query: string) => {
		let location: DictionaryLocation = {};
		let normalizedQuery = query.toLowerCase();
		let rowIndex = this.dictionary.findIndex((row: KeyboardRow) => {
			let keyIndex = row.findIndex((item: KeyboardKey) => {
				let matchesPrimary = item.primary === normalizedQuery;
				let matchesSecondary = item.secondary === normalizedQuery;
				let isMatch = matchesPrimary || matchesSecondary;
				item.usePrimary = matchesPrimary;
				return isMatch;
			});
			let found = keyIndex > -1;
			if (found) location.key = keyIndex;
			return found;
		});

		location.row = rowIndex;
		location.rowExists = rowIndex > -1;

		return location;
	};

	public setQueryDataBasedOnLocation = (location: DictionaryLocation) => {
		let data: QueryData = {};
		let { row, key, rowExists } = location;

		data.isFound = rowExists;
		data.row = row;
		data.key = key;
		data.rowData = rowExists ? this.getRow(row) : false;
		data.keyData = rowExists ? this.getKeyboardKey(row, key) : false;

		return data;
	};

	public generateQueryData = (query: string) => {
		let location: DictionaryLocation = this.getDictionaryLocation(query);
		let data: QueryData = this.setQueryDataBasedOnLocation(location);
		return data;
	};

	public find = (keyValue: string) => {
		let queryData = this.generateQueryData(keyValue);
		let closestKey = queryData.isFound
			? this.getClosestKey(queryData.row, queryData.key)
			: this.getRandomLetter();
		return closestKey;
	};
}

export = ClosestKey;
