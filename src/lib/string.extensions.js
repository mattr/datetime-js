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
