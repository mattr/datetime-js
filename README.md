DateTime.js
===========

DateTime.js is a simple date and time parsing library for initializing dates
(and times) in a more robust manner than the internal Date function in most
browsers (particularly IE8).

DateTime.js assumes that you know at least a bit about the date you're 
working with -- it doesn't provide much in the way of validation beyond 
basic ranges on months, days, hours, minutes and seconds.

DateTime.js is not designed for date-based arithmetic, so there's no methods
like #addDays. It is designed to provide a way of parsing date values with a
variety of formats and providing ways of pretty-printing the result. A 
result of this is that DateTime.js relies on you, the user, to specify 
exactly what you require of the date.

DateTime.js does not currently support any sort of timezone operations. It is
strictly for parsing of existing values and displaying the results in different
formats. If you want to handle timezones, you'll have to do that yourself! At 
least for now...

Constructors
------------

To facilitate date parsing, the DateTime object accepts a number of options for
construction.

Any missing values are interpreted with sensible defaults: a missing year 
defaults to the current year; a missing month defaults to January; a missing 
day defaults to the 1st; missing hours, minutes and seconds default to 0.

The default case is with no parameters, in which case it creates an instance 
set to the current date and time.

### Example ###
	
    var datetime = new DateTime();

The constructor also accepts one or two string arguments. If a single string 
argument is provided, it will attempt to parse the input using the ISO standard
format of `yyyy-MM-dd HH:mm:ss`.

### Example ###

    var datetime = new DateTime("2012-12-12 23:00:00");

If a second string is passed as a parameter, this is treated as a custom format
string for parsing the input. This is the major use-case of the library; the
ability to specify how input strings are formatted for interpretation and 
redesign. The string accepts the following formats:

* (yy)yy  --  2- or 4-digit year. If a two digit year is specified, the parser
              will interpret this as between 1930 and 2029.
* MMMM    --  The full name of the month. (Case insensitive.)
* MMM     --  The 3-letter abbreviation for the month. (Case insensitive.)
* MM      --  The zero-padded month number.
* M       --  The month number. (No zero-padding.)
* dd      --  The zero-padded day of the month.
* d       --  The day of the month. (No zero-padding.)
* HH      --  The hour of the day, zero-padded, in 24-hour format.
* H       --  The hour of the day, in 24-hour format. (No zero-padding.)
* hh      --  The hour of the day, zero-padded, in 12-hour format. Must be 
              accompanied by a meridian marker ("tt" or "TT").
* h       --  The hour of the day, in 12-hour format. (No zero-padding.) Must
              be accompanied by a meridian marker ("tt" or "TT").
* (m)m    --  The minutes of the hour.
* (s)s    --  The seconds of the minute.
* TT      --  The meridian marker, uppercase ("AM" or "PM"). Must be provided
              if using 12-hour specification.
* tt      --  The meridian marker, lowercase ("am" or "pm"). Must be provided
              if using 12-hour specification.

While the parser also accepts "dddd" and "ddd" (day name and day name 3-letter
abbreviation) for printing purposes, these are ignored when parsing input as 
they do not provide any meaningful details for the specification. They should 
still be included, however, to ensure consistent formatting between input and 
format strings.

### Example ###

    var datetime = new DateTime("23/Jul/2013", "dd/MMM/yyyy");


LICENSE
=======

Released under the MIT License. See [License.txt][] for full details.