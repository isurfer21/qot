export default class Utility {
  // Converts double dots to spaces in a string
  static dualDotToSpace(str) {
    // Check if str is not empty and has double dots
    if (str && str.includes('..')) {
      // Replace double dots with spaces
      return str.replace(/\.\./g, ' ');
    }
    return str;
  }
}
