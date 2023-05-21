export default class Trimmer {
  static trim(str, ch) {
    let start = 0,
      end = str.length;

    while (start < end && str[start] === ch) {
      ++start;
    }
    while (end > start && str[end - 1] === ch) {
      --end;
    }
    return start > 0 || end < str.length ? str.substring(start, end) : str;
  }

  static trimAny(str, chars) {
    let start = 0,
      end = str.length;

    while (start < end && chars.indexOf(str[start]) >= 0) {
      ++start;
    }
    while (end > start && chars.indexOf(str[end - 1]) >= 0) {
      --end;
    }
    return start > 0 || end < str.length ? str.substring(start, end) : str;
  }

  static hasSubstringAt(str, substr, pos) {
    let idx = 0,
      len = substr.length;

    for (let max = str.length; idx < len; ++idx) {
      if (pos + idx >= max || str[pos + idx] != substr[idx]) {
        break;
      }
    }

    return idx === len;
  }

  static trimWord(str, word) {
    let start = 0,
      end = str.length,
      len = word.length;

    while (start < end && this.hasSubstringAt(str, word, start)) {
      start += word.length;
    }
    while (end > start && this.hasSubstringAt(str, word, end - len)) {
      end -= word.length;
    }
    return start > 0 || end < str.length ? str.substring(start, end) : str;
  }
}
