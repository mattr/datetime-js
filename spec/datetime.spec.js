var should = chai.should();

describe('DateTime', function() {
  describe("#init", function() {
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

    it("should parse a single string parameter using the ISO date format", function() {
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

  });
});