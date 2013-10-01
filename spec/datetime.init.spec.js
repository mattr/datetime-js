var should = chai.should();

describe("DateTime", function() {
  describe("#init", function() {
    it("should initialize the datetime without validation", function() {
      var datetime = DateTime.init("2112-12-21 21:12:00");
      datetime.year.should.equal(2112);
      datetime.month.should.equal(12);
      datetime.day.should.equal(21);
      datetime.hours.should.equal(21);
      datetime.minutes.should.equal(12);
      datetime.seconds.should.equal(0);
    });
  }); // #init  
});