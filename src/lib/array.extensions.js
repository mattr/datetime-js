/**
 * Extensions to the Array object prototype.
 */

/**
 * Adds the `indexOf` method, missing in IE8.
 */
if (typeof Array.prototype.indexOf !== "function") {
  Array.prototype.indexOf = function(element) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == element) { return i; }
    }
    return -1;
  }
}

/**
 * Adds the `lastIndexOf` method, missing in IE8.
 */
if (typeof Array.prototype.lastIndexOf !== "function") {
  Array.prototype.lastIndexOf = function(element) {
    for (var i = this.length; i--;) {
      if (this[i] == element) { return i; }
    }
    return -1;
  }
}
