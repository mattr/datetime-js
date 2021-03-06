var should = chai.should();

describe('DateTime', function() {
  describe(".ctor", function() {
    it("should default to the current date and time if no parameters passed", function() {
      var datetime = new DateTime();
      var date = new Date();
      datetime.year.should.equal(date.getFullYear());
      datetime.month.should.equal(date.getMonth() + 1);
      datetime.day.should.equal(date.getDate());
      datetime.hours.should.equal(date.getHours());
      datetime.minutes.should.equal(date.getMinutes());
      datetime.seconds.should.equal(date.getSeconds());
      datetime.meridian.should.equal(date.getHours() > 12 ? "pm" : "am");
    });

    it("should parse a single string parameter using the default date format", function() {
      var datetime = new DateTime("2013-07-23 15:00:00");
      datetime.year.should.equal(2013);
      datetime.month.should.equal(7);
      datetime.day.should.equal(23);
      datetime.hours.should.equal(15);
      datetime.minutes.should.equal(0);
      datetime.seconds.should.equal(0);
      datetime.meridian.should.equal("pm");
    });

    it("should parse two string parameters as a date and the custom format", function() {
      var datetime = new DateTime("23/Jul/2013 9:00pm", "dd/MMM/yyyy h:mmtt");
      datetime.year.should.equal(2013);
      datetime.month.should.equal(7);
      datetime.day.should.equal(23);
      datetime.hours.should.equal(21);
    });

    it("should parse a single number as 1 Jan of the specified year", function() {
      var datetime = new DateTime(1999);
      datetime.year.should.equal(1999);
      datetime.month.should.equal(1);
      datetime.day.should.equal(1);
    });

    it("should parse two numbers as the first of the specified month", function() {
      var datetime = new DateTime(2135, 4);
      datetime.year.should.equal(2135);
      datetime.month.should.equal(4);
      datetime.day.should.equal(1);
    });

    it("should parse three numbers as midnight on the specified day of the month and year", function() {
      var datetime = new DateTime(2112,12,21);
      datetime.year.should.equal(2112);
      datetime.month.should.equal(12);
      datetime.day.should.equal(21);
      datetime.hours.should.equal(0);
      datetime.minutes.should.equal(0);
      datetime.seconds.should.equal(0);
      datetime.meridian.should.equal("am");
    });

    it("should parse four numbers as the hour of the specified day, month and year", function() {
      var datetime = new DateTime(2020,2,20,14);
      datetime.year.should.equal(2020);
      datetime.month.should.equal(2);
      datetime.day.should.equal(20);
      datetime.hours.should.equal(14);
      datetime.minutes.should.equal(0);
      datetime.seconds.should.equal(0);
      datetime.meridian.should.equal("pm");
    });

    it("should parse five numbers as the hours and minutes of the specified day, month and year", function() {
      var datetime = new DateTime(2020,2,20,14,57);
      datetime.year.should.equal(2020);
      datetime.month.should.equal(2);
      datetime.day.should.equal(20);
      datetime.hours.should.equal(14);
      datetime.minutes.should.equal(57);
      datetime.seconds.should.equal(0);
      datetime.meridian.should.equal("pm");
    });

    it("should parse six numbers as the hours, minutes and seconds of the specified day, month and year", function() {
      var datetime = new DateTime(2020,2,20,14,57,30);
      datetime.year.should.equal(2020);
      datetime.month.should.equal(2);
      datetime.day.should.equal(20);
      datetime.hours.should.equal(14);
      datetime.minutes.should.equal(57);
      datetime.seconds.should.equal(30);
      datetime.meridian.should.equal("pm");
    });

    it("should ignore any more than the first six numbers passed", function() {
      var datetime = new DateTime(2020,2,20,14,57,30,12,13,14,15);
      datetime.year.should.equal(2020);
      datetime.month.should.equal(2);
      datetime.day.should.equal(20);
      datetime.hours.should.equal(14);
      datetime.minutes.should.equal(57);
      datetime.seconds.should.equal(30);
      datetime.meridian.should.equal("pm");
    });

    // it("should fail if non-string and non-numeric values are passed", function() {
    //   var datetime = new DateTime(new object());
    //   datetime.year.should.equal(undefined);
    // });
  }); // .ctor
});