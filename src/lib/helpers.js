/**
 * Function helpers
 *
 * Adds functions which are missing from the IE8 javascript implementation.
 *
 * The minified version of DateTime includes this file by default. If using
 * the development version, either include this separately, roll your own or
 * ignore at your own risk.
 */
if (typeof String.prototype.trim !== "function") {
  String.prototype.trim = function() {
    this.replace(/^\s+|\s+$/, '');
  };
}
if (typeof Array.prototype.indexOf !== "function") {
  Array.prototype.indexOf = function(element) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == element) { return i; }
    }
    return -1;
  }
}
if (typeof Array.prototype.lastIndexOf !== "function") {
  Array.prototype.lastIndexOf = function(element) {
    for (var i = this.length; i--;) {
      if (this[i] == element) { return i; }
    }
    return -1;
  }
}
