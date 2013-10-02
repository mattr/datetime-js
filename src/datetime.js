/**
 * DateTime
 * ========
 *
 * DateTime.js is a simple date and time parsing library for initializing dates
 * (and times) in a more robust manner than the internal Date function in most
 * browsers (particularly IE8).
 *
 * DateTime.js assumes that you know at least a bit about the date you're
 * working with -- it doesn't provide much in the way of validation beyond
 * basic ranges on months, days, hours, minutes and seconds.
 *
 * DateTime.js is not designed for date-based arithmetic, so there's no methods
 * like #addDays. It is designed to provide a way of parsing date values with a
 * variety of formats and providing ways of pretty-printing the result. A
 * result of this is that DateTime.js relies on you, the user, to specify
 * exactly what you require of the date.
 *
 * @author Matt Redmond
 * @created 18/Sep/2013
 * @updated 02/Oct/2013
 *
 * @version 0.3.1
 *
 * @returns {DateTime} The constructed DateTime instance.
 */
var DateTime = (function() {
  /**
   * Creates a new instance of the DateTime object. Initially all properties
   * are set to <c>null</c>; invalid initialization will result in any
   * remaining properties retaining their <c>null</c> value.
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
    this.validate();
  };

  /***************************************************************************\
   *                                                                         *
   * Private class variables                                                 *
   *                                                                         *
  \***************************************************************************/

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
   * The names of the days to match the javascript Date#getDay method to the
   * day names. Since this relies on wrapping the internal Date#getDay method,
   * it is important that Sunday is listed first if these are changed for
   * language puroses, etc.
   */
  var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  /**
   * @private
   *
   * The default format for parsing input strings and pretty printing with
   * DateTime#toString().
   */
  var defaultFormat = "yyyy-MM-dd HH:mm:ss";

  /**
   * @private
   *
   * The number of days in each month in order. February is 28 here; checks
   * are performed in the evaluation and validation methods.
   */
  var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

  /**
   * @private
   *
   * Regular expression to match the elements in a format string and provide
   * postional information for each.
   */
  var formatStringMatcher = /(\(d{1,4}\)|\(M{1,4}\)|\(y{2,4}\)|\([hH]{1,2}\)|\(m{1,2}\)|\(s{1,2}\)|\([tT]{2}\))/g

  /***************************************************************************\
   *                                                                         *
   * Class methods                                                           *
   *                                                                         *
  \***************************************************************************/

  /**
   * Sets the month names (e.g. to change language).
   *
   * @param {Array} names The array of month names.
   *
   * @note THIS IS NOT VALIDATED!
   */
  DateTime.setMonthNames = function(names) {
    monthNames = names;
  }

  /**
   * Retrieves the array of month names.
   *
   * @returns {Array} The array of month names.
   */
  DateTime.getMonthNames = function() {
    return monthNames;
  }

  DateTime.setDayNames = function(names) {
    dayNames = names;
  }

  DateTime.getDayNames = function() {
    return dayNames;
  }

  /**
   * Sets the default format for the datetime parsing and pretty-print.
   */
  DateTime.setDefaultFormat = function(format) {
    defaultFormat = format;
  }
  /**
   * Retrieves the default format for the datetime parsing and pretty-print.
   */
  DateTime.getDefaultFormat = function() {
    return defaultFormat;
  }

  /***************************************************************************\
   *                                                                         *
   * Function prototypes. These are the functions which will be publicly     *
   * available to the DateTime instance.                                     *
   *                                                                         *
  \***************************************************************************/

  DateTime.prototype = {
    /**
     * Initializes the DateTime instance dynamically based on the provided
     * arguments.
     *
     * The following cases are supported:
     *  1.  No arguments defaults to a new DateTime of today (and now).
     *  2.  One string argument parses the string with the default string
     *      format. By default this is the ISO standard "yyyy-MM-dd HH:mm:ss";
     *      however, it may be reset using DateTime.setDefaultFormat.
     *  3.  Two string arguments parses the first string as a date (and time)
     *      using the second string as a template for the format.
     *  4.  One or more numerical arguments will parse the arguments in order
     *      of increasing specificity (year, month, day, hours, minutes,
     *      seconds), ignoring any values beyond these, and providing sensible
     *      defaults for unspecified values.
     *
     * Providing any other options to the #init function will throw an Error.
     *
     * @param {Array} args The arguments array from the constructor.
     * @returns {DateTime} The DateTime instance.
     */
    init: function(args) {
      if (args.length == 0) {
        initDefault(this);
      }
      else if (args.length == 2 &&
               typeof(args[0]) == "string" &&
               typeof(args[1]) == "string") {
        initFromFormatString(this, args[0], args[1]);
      }
      else if (args.length == 1 && typeof(args[0]) == "string") {
        initFromFormatString(this, args[0], defaultFormat);
      }
      else if (args.length > 0) {
        initFromArray(this, args);
      }
      else {
        throw errorMessage("#init", args);
      }
      setMeridian(this);
      return this;
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
      var errors = [];

      if (validateMonth(this) == false) {
        errors.push("month");
        valid = false;
      }

      if (validateDay(this) == false) {
        errors.push("day");
        valid = false;
      }

      if (validateHours(this) == false) {
        errors.push("hours");
        valid = false;
      }

      if (validateMinutes(this) == false) {
        errors.push("minutes");
        valid = false;
      }

      if (validateSeconds(this) == false) {
        errors.push("seconds");
        valid = false;
      }
      console.log(errorMessage("#validate", errors));
      return valid;
     // if (valid) {
     //    return valid;
     //  }
     //  else {
     //    throw errorMessage("#validate", errors);
     //  }
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
      }
      else if (abbreviated === false || abbreviated === undefined) {
        return monthName;
      }
      else {
        throw errorMessage("#getMonthName", arguments);
      }
    },
    /**
     * Gets the name of the month.
     *
     * @alias getMonthName
     */
    monthName: function(abbreviated) { return this.getMonthName(abbreviated); },

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
      }
      else if (abbreviated === false || abbreviated === undefined) {
        return day;
      }
      else {
        throw errorMessage("#getDayName", arguments);
      }
    },
    /**
     * Gets the name of the day.
     *
     * @alias getDayName
     */
    dayName: function(abbreviated) { return this.getDayName(abbreviated); },

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
     * Overrides the default #toString method for the object, allowing us to
     * specify the formatting of the date. Defaults to the ISO standard
     * "yyyy-MM-dd HH:mm:ss".
     *
     * @param {string} formatString The format string to display the output.
     * @returns {string}  The date in the specified format, or the default
     *                    format if no format string specified.
     */
    toString: function(formatString) {
      if (formatString === undefined) {
        return toFormattedString(this, defaultFormat);
      }
      else {
        return toFormattedString(this, formatString);
      }
    }
  };

  /***************************************************************************\
   *                                                                         *
   * The following methods are private, used internally to construct and     *
   * manage the DateTime instance.                                           *
   *                                                                         *
  \***************************************************************************/

  /**
   * @private
   *
   * Validates the range of the month (between 1 and 12).
   *
   * @param {DateTime} The DateTime instance
   * @returns {boolean} True if the month falls within the accepted range;
   *                    false otherwise.
   */
  function validateMonth(datetime) {
    return datetime.month > 0 && datetime.month < 12;
  }

  /**
   * @private
   *
   * Validates the day of the month.
   *
   * @param {DateTime} datetime The DateTime instance
   * @returns {boolean} True if the day is within the acceptable range for a
   *                    given month; false otherwise.
   */
  function validateDay(datetime) {
    return datetime.day > 0 && datetime.day <= maxDaysInMonth(datetime);
  }

  /**
   * @private
   *
   * Validates the hours of the day.
   *
   * @param {DateTime} datetime The DateTime instance
   * @returns {boolean} True if the hours fall within the acceptable range;
   *                    false otherwise.
   */
  function validateHours(datetime) {
    return datetime.hours >= 0 && datetime.hours < 24;
  }

  /**
   * @private
   *
   * Validates the minutes of the hour.
   *
   * @param {DateTime} datetime The DateTime instance
   * @returns {boolean} True if the minutes fall within the acceptable range;
   *                    false otherwise.
   */
  function validateMinutes(datetime) {
    return datetime.minutes >= 0 && datetime.minutes < 60;
  }

  /**
   * @private
   *
   * Validates the seconds in the hour.
   *
   * @param {DateTime} datetime The DateTime instance
   * @returns {boolean} True if the seconds fall within the acceptable range;
   *                    false otherwise.
   */
  function validateSeconds(datetime) {
    return datetime.seconds >= 0 && datetime.seconds < 60;
  }

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
    var parameterizedFormatString = parameterize(formatString),
        positions = parameterizedFormatString.match(formatStringMatcher),
        parameterMatcher = parameterizedFormatString,
        parameterMatches = [];

    // Replaces the year format with the corresponding regular expression
    // function.
    parameterMatcher = parameterMatcher.replace(/\(y{2,4}\)/, "(\\d{2,4})");
    // Replaces month and day names with the corresponding regular expression
    // function.
    parameterMatcher = parameterMatcher.replace(/\(M{3,4}\)|\(d{3,4}\)/g, "(\\w{3,})");
    // Replaces month numbers, day numbers, hours, minutes and seconds with the
    // corresponding regular expression function.
    parameterMatcher = parameterMatcher.replace(/\(m{1,2}\)|\(d{1,2}\)|\(h{1,2}\)|\(s{1,2}\)/gi, "(\\d{1,2})");
    // Replaces the meridian indicator with the corresponding regular
    // expression function.
    parameterMatcher = parameterMatcher.replace(/\(t{2}\)/gi, "(\\w{2})");

    // Find all the matches within the regular expression function.
    parameterMatches = dateString.match(parameterMatcher);

    datetime.year = setYearFromFormatString(parameterMatches, positions);

    datetime.month = setMonthFromFormatString(parameterMatches, positions);

    datetime.day = setDayFromFormatString(parameterMatches, positions);

    datetime.hours = setHoursFromFormatString(parameterMatches, positions);

    datetime.minutes = setMinutesFromFormatString(parameterMatches, positions);

    datetime.seconds = setSecondsFromFormatString(parameterMatches, positions);

    setMeridian(datetime);
    return datetime;
  }

  /**
   * @private
   *
   * Initializes the DateTime object using an integer array.
   *
   * The array specifies the date parts in increasing specificity:
   *
   *  year, month, day, hours, minutes and seconds
   *
   * Any unspecified elements are defaulted sensibly: year to the current,
   * month to January, day to the 1st, hours, minutes and seconds zeroed to
   * midnight.
   */
  function initFromArray(datetime, dateArray) {
    // We shouldn't ever get here without at least one argument passed through,
    // so this is just a fail-safe.
    if (dateArray.length == 0){
      throw errorMessage("#initFromArray", dateArray);
    }
    // Specifieds the various properties to be set.
    var properties = ["year", "month", "day", "hours", "minutes", "seconds"];
    // Initializes all the specified properties from the constructor.
    for (var i = 0; i < dateArray.length; i++) {
      datetime[properties[i]] = parseInt(dateArray[i]);
    }
    // Loops through month and day to set them to Jan and 1st of the month if
    // not specified.
    for (var i = 1; i < 3; i++) {
      if (!datetime[properties[i]]) {
        datetime[properties[i]] = 1;
      }
    }
    // Loops through the hours, minutes and seconds and sets them to 0
    // (midnight) if not specified.
    for (var i = 3; i < properties.length; i++) {
      if (!datetime[properties[i]]) {
        datetime[properties[i]] = 0;
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
    // Array index is one less than the month number.
    var index = datetime.month - 1;
    // Start with the max specified in the array, which is always valid except
    // for February.
    var max = daysInMonth[index];
    // For February, check against leap year, century and millenium criteria.
    if (index == 1) {
      // 29 days in Feb for leap years for the millenium and any multiple of 4
      // not the turn of a century.
      if (datetime.year % 1000 == 0 || (datetime.year % 4 == 0 && datetime.year % 100 != 0)) {
        max += 1;
      }
    }
    return max;
  }

  /**
   * @private
   *
   * Gets the month number from the specified name. Works with both the full
   * month name and the abbreviation.
   *
   * @param {string} monthName  The name of the month, either in full or 3-
   *                            letter abbreviation.
   * @returns {number}  The number of the month (by calendar, rather than
   *                    array-based), or -1 if a bad name is specified.
   */
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
   * Sets the year value based on the matches found in the provided format
   * string.
   *
   * @param {Array} matches The matches from the regular expression.
   * @param {Array} positions The positional references used to extract the
   *                          year entries.
   */
  function setYearFromFormatString(matches, positions) {
    var position = -1,
        pad = false;

    if (positions.indexOf("(yyyy)") >= 0) {
      position = positions.indexOf("(yyyy)") + 1;
    }
    else if (positions.indexOf("(yy)") >= 0) {
      position = positions.indexOf("(yy)") + 1;
      pad = true;
    }
    var year = position > 0 ? parseInt(matches[position]) : 2013;

    if (pad && year.toString().length == 2) {
      // For padding, we set dates from 1930-2029 by default.
      year += year < 30 ? 2000 : 1900;
      // if (year < 30) {
      //   year += 2000;
      // }
      // else {
      //   year += 1900;
      // }
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
   *
   * @param {Array} matches The array of matched elements from the regular expression.
   * @param {Array} positions The positional references for the matched elements.
   * @returns {number} The day of the month based on the specified data.
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

  /**
   * @private
   */
  function setHoursFromFormatString(matches, positions) {
    var hours = 0,
        position = -1,
        requiresMeridian = false,
        zeropadded = true;

    if (positions.indexOf("(HH)") >= 0) {
      position = positions.indexOf("(HH)") + 1;
    }
    else if (positions.indexOf("(hh)") >= 0) {
      position = positions.indexOf("(hh)") + 1;
      requiresMeridian = true;
    }
    else if (positions.indexOf("(H)") >= 0) {
      position = positions.indexOf("(H)") + 1;
      zeropadded = false;
    }
    else if (positions.indexOf("(h)") >= 0) {
      position = positions.indexOf("(h)") + 1;
      zeropadded = false;
      requiresMeridian = true;
    }
    else {
      return 0
    }
    hours = parseInt(matches[position]);

    if (requiresMeridian) {
      if ( positions.indexOf("(tt)") < 0 && positions.indexOf("(TT)") < 0 ) {
        throw new Error("No meridian specified with 12-hour format: [" + matches + "], [" + positions + "]");
      }
      else {
        if (matches[positions.indexOf("(tt)") + 1].toLowerCase() == "pm" || matches[positions.indexOf("(TT)") + 1].toLowerCase() == "pm") {
          hours += 12;
        }
      }
    }
    return hours;
  }

  /**
   * @private
   */
  function setMinutesFromFormatString(matches, positions) {
    var position = -1;
    if (positions.indexOf("(mm)") >= 0) {
      position = positions.indexOf("(mm)") + 1;
    }
    return position > 0 ? parseInt(matches[position]) : 0;
  }

  /**
   * @private
   */
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
   * @returns {string} "am" or "pm" depending on the hour value.
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
    return new Error(msg);
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
   * Zero-pads a number, i.e. if less than ten, prefix with "0". Only works on
   * two-digit numbers, since we don't have to zero-pad beyond this for days
   * and months.
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
   * Un-zeropads the number by stripping the leading '0' for numbers less than
   * 10. Only strips a single '0', since we don't exceed double digits for days
   * and months.
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
