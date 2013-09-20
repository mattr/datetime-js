var DateTime = (function() {
  /**
   * Creates a new instance of the DateTime object.
   *
   * @constructor
   * @this {DateTime}
   * @param
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

      // if (arguments.length > 1) {
      //   initFromFormatString(this, arguments[0], arguments[1]);
      // }
      // else if (arguments.length == 1) {
      //   if (typeof(arguments[0]) === "Array") {
      //     initFromArray(this, arguments[0]);
      //   }
      //   else {
      //     initFromFormatString(this, arguments[0], "yyyy-MM-dd HH:mm:ss");
      //   }
      // }
      // initDefault(this);
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

  /**
   * @private
   *
   * Initializes the DateTime object using the specified format string.
   * This is the inverse of the #toString/#toFormattedString functionality.
   *
   * Not sure how we're going to do this one yet...
   */
  function initFromFormatString(datetime, dateString, formatString) {
    var regExp = new RegExp("^(\\d{2})-(\\w{3})-(\\d{4}) (\\d{2}):(\\d{2})$");
    console.log(makeRegExpy(formatString));
    // TODO: How do we determine the order of the items that are matched?

    var format = makeRegExpy(formatString);

    var posRegExp = /(\(d{1,4}\)|\(M{1,4}\)|\(y{2,4}\)|\([hH]{1,2}\)|\(m{1,2}\)|\([tT]{2}\))/g;

    var positions = format.match(posRegExp);

    console.log(positions);

    var re = format.replace(/\(y{2,4}\)/, "(\\d{2,4})");
    re = re.replace(/\(M{3,4}\)|\(d{3,4}\)/g, "(\\w{3,})");
    re = re.replace(/\(m{1,2}\)|\(d{1,2}\)|\(h{1,2}\)/gi, "(\\d{1,2})");
    re = re.replace(/\(t{2}\)/gi, "(\\w{2})");

    console.log(re);

    var matches = dateString.match(re);
    console.log(matches);
    // datetime.day = parseInt(matches[matches[1]]);
    // datetime.year = parseInt(matches[3]);
    // datetime.month = getMonthFromName(matches[2]);
    // datetime.hours = parseInt(matches[4]);
    // datetime.minutes = parseInt(matches[5]);
    // datetime.seconds = 0;
    var yearPos = -1;
    var padYear = false;
    if (positions.indexOf("(yyyy)") >= 0) {
      yearPos = positions.indexOf("(yyyy)") + 1;
    }
    else if (positions.indexOf("(yy)") >= 0) {
      yearPos = positions.indexOf("(yy)") + 1;
      padYear = true;
    }
    var year = yearPos > 0 ? parseInt(matches[yearPos]) : 2013;

    if (padYear) {
      if (year < 30) {
        year += 2000;
      }
      else {
        year += 1900;
      }
    }
    datetime.year = year;

    var monthPos = -1;
    var useIntMonth = true;
    if (positions.indexOf("(MMMM)") >= 0) {
      monthPos = positions.indexOf("(MMMM)") + 1;
      useIntMonth = false;
    }
    else if (positions.indexOf("(MMM)") >= 0) {
      monthPos = positions.indexOf("(MMM)") + 1;
      useIntMonth = false;
    }
    else if (positions.indexOf("(MM)") >= 0) {
      monthPos = positions.indexOf("(MM)") + 1;
    }
    else if (positions.indexOf("(M)") >= 0) {
      monthPos = positions.indexOf("(M)") + 1;
    }

    if (useIntMonth) {
      datetime.month = parseInt(matches[monthPos]);
    }
    else {
      // Select from the array;
      if (matches[monthPos].length > 3) {
        datetime.month = monthName.indexOf(matches[monthPos]) + 1;
      }
      else {
        var shortMonthNames = [];
        for (var i = 0; i < monthNames.length; i++) {
          shortMonthNames.push(monthNames[i].slice(0,3));
        }
        datetime.month = shortMonthNames.indexOf(matches[monthPos]) + 1;
      }
    }
    var dayPos = -1;
    var zeropadded = false;
    if (positions.indexOf("(dd)") >= 0) {
      dayPos = positions.indexOf("(dd)") + 1;
      zeropadded = true;
    }
    else if (positions.indexOf("(d)") >= 0) {
      dayPos = positions.indexOf("(d)") + 1;
    }

    var day = dayPos > 0 ? matches[dayPos] : 1;
    datetime.day = parseInt(zeropadded ? unzeropad(day) : day);

    var hoursPos = -1;
    zeropadded = false;
    if (positions.indexOf("(HH)") >= 0) {
      hoursPos = positions.indexOf("(HH)") + 1;
      zeropadded = true;
    }
    else if (positions.indexOf("(hh)") >= 0) {
      hoursPos = positions.indexOf("(hh)") + 1;
      zeropadded = true;
    }
    else if (positions.indexOf("(H)") >= 0) {
      hoursPos = positions.indexOf("(H)") + 1;
    }
    else if (positions.indexOf("(h)") >= 0) {
      hoursPos = positions.indexOf("(h)") + 1;
    }
    var hours = hoursPos > 0 ? matches[hoursPos] : 0;
    hours = zeropadded ? unzeropad(hours) : hours;
    datetime.hours = parseInt(hours);

    if (positions.indexOf("tt") >= 0 || positions.indexOf("TT") >= 0) {
      if (matches[positions.indexOf("tt") + 1] == "pm" || matches[positions.indexOf("TT") + 1] == "PM") {
        if (datetime.hours < 12) {
          datetime.hours += 12;
        }
      }
    }

    var minPos = -1;
    if (positions.indexOf("(mm)") >= 0) {
      minPos = positions.indexOf("(mm)") + 1;
    }
    datetime.minutes = minPos > 0 ? parseInt(matches[minPos]) : 0;

    var secPos = -1;
    if (positions.indexOf("(ss)") >= 0) {
      secPos = positions.indexOf("(ss)") + 1;
    }
    datetime.seconds = secPos > 0 ? parseInt(matches[secPos]) : 0;

    console.log(datetime.year);
    console.log(datetime.month);
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

  function getMonthFromName(monthName) {
    for (var i = 0; i < monthNames.length; i++) {
      if (monthName.slice(0,3).toUpperCase() == monthNames[i].slice(0,3).toUpperCase()) {
        return i+1;
      }
    }
    return 0;
  }

  /**
   * @private
   *
   * Default initialization to right now.
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
   */
  function getMeridian(hour) {
    return hour < 12 ? "am" : "pm";
  }

  function setMeridian(datetime) {
    datetime.meridian = getMeridian(datetime.hours);
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
   */
  function toFormattedString(datetime, formatString) {
    var datestring = makeRegExpy(formatString);
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

  function makeRegExpy(string) {
    string = string.replace(/(y{2,4})/g, "($1)");
    string = string.replace(/(M{1,4})/g, "($1)");
    string = string.replace(/(d{1,4})/g, "($1)");
    string = string.replace(/(h{1,2})/ig, "($1)");
    string = string.replace(/(m{2})/g, "($1)");
    string = string.replace(/(s{2})/g, "($1)");
    string = string.replace(/(t{2})/ig, "($1)");
    console.log(string);
    return string;
  }

  function createRegExpFromString(string) {


  }

  /**
   * @private
   *
   * Zero-pads a number, i.e. if less than ten, prefix with "0".
   */
  function zeropad(number) {
    return number < 10 ? "0" + number : "" + number;
  }

  function unzeropad(number) {
    return number.substring(0,1) == "0" ? number.substring(1) : number;
  }

  /**
   * Returns the constructed object.
   */
  return DateTime;
})();