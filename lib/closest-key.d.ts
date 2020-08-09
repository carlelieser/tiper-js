import { KeyboardRow, KeyboardKey } from "./key-dictionary";
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
declare class ClosestKey {
    private dictionary;
    constructor();
    private getRow;
    private getKeyboardKey;
    private getKeyShift;
    private getCorrectArithmetic;
    private getRandomLetter;
    private getClosestKeyIndex;
    private getClosestKey;
    getDictionaryLocation: (query: string) => DictionaryLocation;
    setQueryDataBasedOnLocation: (location: DictionaryLocation) => QueryData;
    generateQueryData: (query: string) => QueryData;
    find: (keyValue: string) => any;
}
export = ClosestKey;
