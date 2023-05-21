export default class Lexer {
  static isAlphaNumeric(char) {
    return /[a-z0-9]/i.test(char);
  }

  static isWhiteSpace(char) {
    return /\s/.test(char);
  }

  static isParenthesis(char) {
    return /[\(\)]/.test(char);
  }

  static isBracket(char) {
    return /[\[\]]/.test(char);
  }

  static isComma(char) {
    return char === ',';
  }

  static isAsterisk(char) {
    return char === '*';
  }

  static isQuote(char) {
    return /['`"]/.test(char);
  }

  static isSpecialChar(char) {
    return /[_@#$]/.test(char);
  }

  static isWildcardChar(char) {
    return /[%*]/.test(char);
  }
}
