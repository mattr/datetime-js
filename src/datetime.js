var DateTime = (function() {
  /**
   * Creates a new instance of the DateTime object.
   *
   * @constructor
   * @this {DateTime}
   */
  var DateTime = function() {
    this.year = null;
    this.month = null;
    this.day = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
    this.meridian = null;
    this.init(arguments);
    var valid = this.validate();
    if (!valid) {
      throw errorMessage(".ctor", "Invalid date specification!");
    }
  };

  /**
   * Function prototypes
   */
  DateTime.prototype = {
    init: function(args) {
      if (args.length == 0){
        initDefault(this);
      }
      else if (args.length == 2 && typeof(args[0]) == "string" && typeof(args[1]) == "string") {
        initFromFormatString(this, args[0], args[1]);
      }
      else if (args.length == 1 && typeof(args[0]) == "string") {
        initFromFormatString(this, args[0], "dd-MMM-yyyy HH:mm");
      }
      else if (args.length > 0) {
        initFromArray(this, args);
      }
      else {
        throw errorMessage("#init", args);
      }
      setMeridian(this);
    },
    /**
     * Validates the DateTime instance.
     *
     * Does not perform any sort of calculation. This just checks the ranges for each of the
     * attributes in the DateTime instance.
     *
     * @this {DateTime}
     */
    validate: function() {
      // Let's assume that people can write the date and it is valid.
      var valid = true;
      // If the month is outside the acceptable range, invalidate.
      if (this.month < 1 || this.month > 12) {
        valid = false;
      }
      // If the day is outside the available range, or doesn't match the current month, invalidate.
      if (this.day < 1 || this.day > 31 || this.day > maxDaysInMonth(this)) {
        valid = false;
      }
      // If the hours are outside the acceptable range, invalidate.
      if (this.hours < 0 || this.hours > 24) {
        valid = false;
      }
      // If the minutes are outside the acceptable range, invalidate.
      if (this.minutes < 0 || this.minutes > 60) {
        valid = false;
      }
      // If the seconds are outside the acceptable range, invalidate.
      if (this.seconds < 0 || this.seconds > 60) {
        valid = false;
      }
      return valid;
    },
    /**
     * Gets the name of the month.
     *
     * @param {boolean} abbreviated  Whether the returned value should be abbreviated.
     * @returns {string} Name of the month, either full (default) or abbreviated.
     */
    getMonthName: function(abbreviated) {
      var monthName = monthNames[this.month - 1];
      if (abbreviated === true) {
        return monthName.slice(0,3);
      } else if (abbreviated === false || abbreviated === undefined) {
        return monthName;
      }
      else {
        throw errorMessage("#getMonthName", arguments);
      }
    },
    /**
     * Gets the name of the day of the week.
     *
     * @param {boolean} abbreviated  Whether the returned value should be abbreviated.
     * @returns {string} The name of the month, either abbreviated to four letters or the full name (default).
     */
    getDayName: function(abbreviated) {
      var date = new Date(this.year, this.month - 1, this.day);
      var day = dayNames[date.getDay()];
      if (abbreviated === true) {
        return day.slice(0,3);
      } else if (abbreviated === false || abbreviated === undefined) {
        return day;
      }
      else {
        throw errorMessage("#getDayName", arguments);
      }
    },
    /**
     * Gets the hours attribute in 24 or 12 hour time.
     *
     * @param {boolean} useTwentyFourHourFormat  Use twenty-four hour format, or twelve-hour format.
     * @returns {integer} The hour, in twenty-four (default) or twelve-hour format.
     */
    getHours: function(useTwentyFourHourFormat) {
      var hours = this.hours % 12;
      if (hours == 0) hours = 12;
      if (useTwentyFourHourFormat === true) {
        return this.hours;
      }
      else if (useTwentyFourHourFormat === false || useTwentyFourHourFormat === undefined) {
        return hours;
      }
      else {
        throw errorMessage("#getHours", arguments);
      }
    },
    /**
     * @override
     *
     * Overrides the default #toString method for the object, allowing us to specify the
     * formatting of the date. Defaults to "yyyy-MM-dd HH:mm:ss".
     *
     * @param {string} formatString The format string to display the output.
     * @returns {string} The date in the specified format, or the default format if no format string specified.
     */
    toString: function(formatString) {
      if (formatString === undefined) {
        return toFormattedString(this, "yyyy-MM-dd HH:mm:ss");
      }
      else {
        var valid = validateFormatString(formatString);
        if (valid) {
          return toFormattedString(this, formatString);
        }
        else {
          throw "Invalid format string in #toString: " + formatString;
        }
      }
    },
    toRegExp: function(string) {
      return createRegExpFromString(string);
    }
  };

  /**
   * @private
   *
   * Validates the provided format string for bad characters.
   *
   * @param {string} formatString The format string.
   * @returns {boolean} The validity of the format string.
   */
  function validateFormatString(formatString) {
    return true;
  }

  /**
   * @private
   *
   * The names of the months to match when using #toString, or #getMonthName
   */
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  /**
   * @private
   *
   * The names of the days to match the javascript #getDay method to the
   * day names.
   */
  var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wendesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

  /**
   * @private
   *
   * Initializes the DateTime object using the specified format string.
   * This is the inverse of the #toString/#toFormattedString functionality.
   *
   * @param {DateTime} datetime The current DateTime instance.
   * @param {string} dateString The string representation of the required date/time.
   * @param {string} formatString The specified format string to parse the dateString.
   * @returns {DateTime} The current DateTime instance.
   */
  function initFromFormatString(datetime, dateString, formatString) {
    var format = parameterize(formatString);
    var posRegExp = /(\(d{1,4}\)|\(M{1,4}\)|\(y{2,4}\)|\([hH]{1,2}\)|\(m{1,2}\)|\([tT]{2}\))/g;
    var positions = format.match(posRegExp);

    var re = format.replace(/\(y{2,4}\)/, "(\\d{2,4})");
    re = re.replace(/\(M{3,4}\)|\(d{3,4}\)/g, "(\\w{3,})");
    re = re.replace(/\(m{1,2}\)|\(d{1,2}\)|\(h{1,2}\)/gi, "(\\d{1,2})");
    re = re.replace(/\(t{2}\)/gi, "(\\w{2})");

    console.log(re);

    var matches = dateString.match(re);

    datetime.year = setYearFromFormatString(matches, positions);

    datetime.month = setMonthFromFormatString(matches, positions);

    datetime.day = setDayFromFormatString(matches, positions);

    datetime.hours = setHoursFromFormatString(matches, positions);

    if (positions.indexOf("tt") >= 0 || positions.indexOf("TT") >= 0) {
      if (matches[positions.indexOf("tt") + 1] == "pm" || matches[positions.indexOf("TT") + 1] == "PM") {
        if (datetime.hours < 12) {
          datetime.hours += 12;
        }
      }
    }

    datetime.minutes = setMinutesFromFormatString(matches, positions);

    datetime.seconds = setSecondsFromFormatString(matches, positions);

    setMeridian(datetime);
    return datetime;
  }

  /**
   * @private
   *
   * Initializes the DateTime object using an integer array.
   *
   * The array specifies the year, month, day, hours, minutes and seconds, or
   * part thereof (in order).
   */
  function initFromArray(datetime, dateArray) {
    if (dateArray.lenght == 0){
      throw errorMessage("#initFromArray", dateArray);
    }
    var parts = ["year", "month", "day", "hours", "minutes", "seconds"];
    for (var i = 0; i < dateArray.length; i++) {
      datetime[parts[i]] = dateArray[i];
    }
    for (var i = 1; i < 3; i++) {
      if (!datetime[parts[i]]) {
        datetime[parts[i]] = 1;
      }
    }
    for (var i = 3; i < parts.length; i++) {
      if (!datetime[parts[i]]) {
        datetime[parts[i]] = 0;
      }
    }
    return datetime;
  }

  /**
   * @private
   *
   * Determines the maximum number of days available in a given month. This is easy, except
   * when dealing with February and leap years.
   *
   * @param {DateTime} datetime The current DateTime instance.
   * @returns {number} The maximum number of days in the month specified by datetime.
   */
  function maxDaysInMonth(datetime) {
    var index = datetime.month - 1;
    var max = daysInMonth[index];
    if (index == 1) {
      // 29 days in Feb for leap years for the millenium and any multiple of 4 not the turn of a century.
      if (datetime.year % 1000 == 0 || (datetime.year % 4 == 0 && datetime.year % 100 != 0)) {
        max += 1;
      }
    }
    return max;
  }

  function getMonthFromName(monthName) {
    for (var i = 0; i < monthNames.length; i++) {
      if (monthName.slice(0,3).toUpperCase() == monthNames[i].slice(0,3).toUpperCase()) {
        return i+1;
      }
    }
    return -1;
  }

  /**
   * @private
   *
   * Sets the year value based on the matches found in the provided format string.
   *
   * @param {Array} matches The matches from the regular expression.
   * @param {Array} positions The positional references for the year entries.
   */
  function setYearFromFormatString(matches, positions) {
    var position = -1;
    var padYear = false;
    if (positions.indexOf("(yyyy)") >= 0) {
      position = positions.indexOf("(yyyy)") + 1;
    }
    else if (positions.indexOf("(yy)") >= 0) {
      position = positions.indexOf("(yy)") + 1;
      padYear = true;
    }
    var year = position > 0 ? parseInt(matches[position]) : 2013;

    if (padYear && year.toString().length == 2) {
      if (year < 30) {
        year += 2000;
      }
      else {
        year += 1900;
      }
    }
    return year;
  }

  /**
   * @private
   *
   * Sets the month value based on the matches found in the provided format string.
   *
   * @param {Array} matches The matches returned by the regular expression.
   * @param {Array} positions The positional reference for each month value within the matches array.
   * @returns {number} The month number between 1 and 12.
   */
  function setMonthFromFormatString(matches, positions) {
    var position = -1;
    var useIntMonth = true;
    if (positions.indexOf("(MMMM)") >= 0) {
      position = positions.indexOf("(MMMM)") + 1;
      useIntMonth = false;
    }
    else if (positions.indexOf("(MMM)") >= 0) {
      position = positions.indexOf("(MMM)") + 1;
      useIntMonth = false;
    }
    else if (positions.indexOf("(MM)") >= 0) {
      position = positions.indexOf("(MM)") + 1;
    }
    else if (positions.indexOf("(M)") >= 0) {
      position = positions.indexOf("(M)") + 1;
    }
    return useIntMonth ? parseInt(matches[position]) : getMonthFromName(matches[position]);
  }

  /**
   * @private
   *
   * Sets the day value from the matches found in the provided format string.
   */
  function setDayFromFormatString(matches, positions) {
    var position = -1;
    var zeropadded = false;
    if (positions.indexOf("(dd)") >= 0) {
      position = positions.indexOf("(dd)") + 1;
      zeropadded = true;
    }
    else if (positions.indexOf("(d)") >= 0) {
      position = positions.indexOf("(d)") + 1;
    }

    var day = position > 0 ? matches[position] : 1;
    return parseInt(zeropadded ? unzeropad(day) : day);
  }

  function setHoursFromFormatString(matches, positions) {
    var position = -1;
    zeropadded = false;
    if (positions.indexOf("(HH)") >= 0) {
      position = positions.indexOf("(HH)") + 1;
      zeropadded = true;
    }
    else if (positions.indexOf("(hh)") >= 0) {
      position = positions.indexOf("(hh)") + 1;
      zeropadded = true;
    }
    else if (positions.indexOf("(H)") >= 0) {
      position = positions.indexOf("(H)") + 1;
    }
    else if (positions.indexOf("(h)") >= 0) {
      position = positions.indexOf("(h)") + 1;
    }
    var hours = position > 0 ? matches[position] : 0;
    hours = zeropadded ? unzeropad(hours) : hours;
    return parseInt(hours);
  }

  function setMinutesFromFormatString(matches, positions) {
    var position = -1;
    if (positions.indexOf("(mm)") >= 0) {
      position = positions.indexOf("(mm)") + 1;
    }
    return position > 0 ? parseInt(matches[position]) : 0;
  }

  function setSecondsFromFormatString(matches, positions) {
    var position = -1;
    if (positions.indexOf("(ss)") >= 0) {
      position = positions.indexOf("(ss)") + 1;
    }
    return position > 0 ? parseInt(matches[position]) : 0;
  }

  /**
   * @private
   *
   * Default initialization to right now.
   *
   * @param {DateTime} datetime The current DateTime instance.
   * @returns {DateTime} The current DateTime instance.
   */
  function initDefault(datetime) {
    var d = new Date();
    datetime.year = d.getFullYear();
    datetime.month = d.getMonth() + 1;
    datetime.day = d.getDate();
    datetime.hours = d.getHours();
    datetime.minutes = d.getMinutes();
    datetime.seconds = d.getSeconds();
    datetime.meridian = getMeridian(this.hours);
    return datetime;
  }

  /**
   * @private
   *
   * Finds the meridian for the time, i.e. "am" or "pm".
   *
   * @param {number} hour The hour of the day in 24-hour format.
   */
  function getMeridian(hour) {
    return hour < 12 ? "am" : "pm";
  }

  /**
   * @private
   *
   * Sets the meridian property based on the value of the hours property.
   *
   * @param {DateTime} datetime The current DateTime instance.
   * @returns {DateTime} The current DateTime instance.
   */
  function setMeridian(datetime) {
    datetime.meridian = getMeridian(datetime.hours);
    return datetime;
  }

  /**
   * @private
   *
   * Formatting for error messages.
   */
  function errorMessage(methodName, args) {
    var msg = "Invalid parameter for method " + methodName + ": [";
    for (var i = 0; i < args.length - 1; i++) {
      msg += args[i] +", ";
    }
    msg += args[args.length - 1] + "]";
    return msg;
  }

  /**
   * @private
   *
   * Creates a formatted string representation of the DateTime object.
   *
   * @param {DateTime} datetime The current DateTime instance.
   * @param {string} formatString The format string to use for display.
   * @returns {string} The formatted DateTime instance.
   */
  function toFormattedString(datetime, formatString) {
    var datestring = parameterize(formatString);
    datestring = datestring.replace("(yyyy)", datetime.year);
    datestring = datestring.replace("(yy)", datetime.year.toString().slice(2));
    datestring = datestring.replace("(MMMM)", datetime.getMonthName());
    datestring = datestring.replace("(MMM)", datetime.getMonthName(true));
    datestring = datestring.replace("(MM)", zeropad(datetime.month));
    datestring = datestring.replace("(M)", datetime.month);
    datestring = datestring.replace("(dddd)", datetime.getDayName());
    datestring = datestring.replace("(ddd)", datetime.getDayName(true));
    datestring = datestring.replace("(dd)", zeropad(datetime.day));
    datestring = datestring.replace("(d)", datetime.day);
    datestring = datestring.replace("(HH)", zeropad(datetime.hours));
    datestring = datestring.replace("(H)", datetime.hours);
    datestring = datestring.replace("(hh)", zeropad(datetime.getHours(false)));
    datestring = datestring.replace("(h)", datetime.getHours(false));
    datestring = datestring.replace("(mm)", zeropad(datetime.minutes));
    datestring = datestring.replace("(ss)", zeropad(datetime.seconds));
    datestring = datestring.replace("(TT)", datetime.meridian.toUpperCase());
    datestring = datestring.replace("(tt)", datetime.meridian.toLowerCase());
    return datestring;
  }

  /**
   * @private
   *
   * Parameterizes a format string so that we don't accidentally overwrite other elements.
   * Individual elements are replaced with versions in parentheses.
   *
   * Example:
   *    "dddd, d/MMM/yyyy hh:mmtt" -> "(dddd), (d)/(MMM)/(yyyy) (hh):(mm)(tt)"
   *
   * @param {string} string The format string
   * @returns {string} Parameterized version of the format string.
   */
  function parameterize(string) {
    string = string.replace(/(y{2,4})/g, "($1)");
    string = string.replace(/(M{1,4})/g, "($1)");
    string = string.replace(/(d{1,4})/g, "($1)");
    string = string.replace(/(h{1,2})/ig, "($1)");
    string = string.replace(/(m{2})/g, "($1)");
    string = string.replace(/(s{2})/g, "($1)");
    string = string.replace(/(t{2})/ig, "($1)");
    return string;
  }

  /**
   * @private
   *
   * Zero-pads a number, i.e. if less than ten, prefix with "0".\
   *
   * @param {number} number The number to be padded.
   * @returns {string} The number with '0' prefixed for values less than 10.
   */
  function zeropad(number) {
    return number < 10 ? "0" + number : "" + number;
  }

  /**
   * @private
   *
   * Un-zeropads the number by stripping the leading '0' for numbers less than 10.
   *
   * @param {string} number The string representation of the number.
   * @returns {number} The number, with any leading '0' removed.
   */
  function unzeropad(number) {
    return number.substring(0,1) == "0" ? number.substring(1) : number;
  }

  /**
   * Returns the constructed object.
   */
  return DateTime;
})();