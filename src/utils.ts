const Utils = {
	getRandomArbitrary: (min: number, max: number) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	shuffleArray: (arr: any) => {
		let arrCopy = [...arr];
		for (let k = arrCopy.length - 1; k > 0; k--) {
			let index = Math.floor(Math.random() * k);
			let temp = arrCopy[k];
			arrCopy[k] = arrCopy[index];
			arrCopy[index] = temp;
		}
		return arrCopy;
	},
	trim: (str: string) => {
		return str.trim();
	},
};

export = Utils;
