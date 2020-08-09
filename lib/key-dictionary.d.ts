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
declare const Dictionary: Array<KeyboardRow>;
export default Dictionary;
