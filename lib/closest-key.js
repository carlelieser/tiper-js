"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var utils_1 = __importDefault(require("./utils"));
var key_dictionary_1 = __importDefault(require("./key-dictionary"));
var ClosestKey = /** @class */ (function () {
    function ClosestKey() {
        var _this = this;
        this.getRow = function (index) {
            if (index > _this.dictionary.length - 1 || index < 0)
                throw new Error("Object at index " + index + " not found.");
            return _this.dictionary[index];
        };
        this.getKeyboardKey = function (rowIndex, keyIndex) {
            var rowData = _this.getRow(rowIndex);
            var keyData = rowData[keyIndex];
            return keyData;
        };
        this.getKeyShift = function (rowIndex, keyIndex) {
            var keyboardRow = _this.getRow(rowIndex);
            var charsLeft = keyboardRow.length - 1 - keyIndex;
            var end = charsLeft > 2 ? 2 : charsLeft;
            var shift = utils_1.default.getRandomArbitrary(1, end);
            return shift;
        };
        this.getCorrectArithmetic = function (key, keyIndex, shift, rowLength) {
            var shouldSubtract = key.last || keyIndex + shift >= rowLength;
            var mathSign = shouldSubtract ? "-" : "+";
            return mathSign;
        };
        this.getRandomLetter = function () {
            var alphabet = "abcdefghijklmnopqrstuvwxyz";
            var index = utils_1.default.getRandomArbitrary(0, alphabet.length - 1);
            var letter = alphabet.charAt(index);
            return letter;
        };
        this.getClosestKeyIndex = function (rowIndex, keyIndex) {
            var keyboardRow = _this.getRow(rowIndex);
            var keyboardKey = _this.getKeyboardKey(rowIndex, keyIndex);
            var shift = _this.getKeyShift(rowIndex, keyIndex);
            var arithmetic = _this.getCorrectArithmetic(keyboardKey, keyIndex, shift, keyboardRow.length);
            var index = eval(keyIndex + " " + arithmetic + " " + shift);
            return index;
        };
        this.getClosestKey = function (rowIndex, keyIndex) {
            var keyboardRow = _this.getRow(rowIndex);
            var currentKey = _this.getKeyboardKey(rowIndex, keyIndex);
            var newKeyIndex = _this.getClosestKeyIndex(rowIndex, keyIndex);
            var closestKey = keyboardRow[newKeyIndex];
            if (currentKey.usePrimary)
                closestKey = closestKey.primary;
            else
                closestKey = closestKey.secondary;
            return closestKey;
        };
        this.getDictionaryLocation = function (query) {
            var location = {};
            var normalizedQuery = query.toLowerCase();
            var rowIndex = _this.dictionary.findIndex(function (row) {
                var keyIndex = row.findIndex(function (item) {
                    var matchesPrimary = item.primary === normalizedQuery;
                    var matchesSecondary = item.secondary === normalizedQuery;
                    var isMatch = matchesPrimary || matchesSecondary;
                    item.usePrimary = matchesPrimary;
                    return isMatch;
                });
                var found = keyIndex > -1;
                if (found)
                    location.key = keyIndex;
                return found;
            });
            location.row = rowIndex;
            location.rowExists = rowIndex > -1;
            return location;
        };
        this.setQueryDataBasedOnLocation = function (location) {
            var data = {};
            var row = location.row, key = location.key, rowExists = location.rowExists;
            data.isFound = rowExists;
            data.row = row;
            data.key = key;
            data.rowData = rowExists ? _this.getRow(row) : false;
            data.keyData = rowExists ? _this.getKeyboardKey(row, key) : false;
            return data;
        };
        this.generateQueryData = function (query) {
            var location = _this.getDictionaryLocation(query);
            var data = _this.setQueryDataBasedOnLocation(location);
            return data;
        };
        this.find = function (keyValue) {
            var queryData = _this.generateQueryData(keyValue);
            var closestKey = queryData.isFound
                ? _this.getClosestKey(queryData.row, queryData.key)
                : _this.getRandomLetter();
            return closestKey;
        };
        this.dictionary = key_dictionary_1.default;
    }
    return ClosestKey;
}());
module.exports = ClosestKey;
//# sourceMappingURL=closest-key.js.map