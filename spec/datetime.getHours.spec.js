var should = chai.should();

describe("DateTime", function() {
  describe("#getHours", function() {
    it("should return the hours in 12-hour format if no parameters passed", function() {
      var datetime = new DateTime(2012,12,21,21,30);
      datetime.getHours().should.equal(9);
    });
    it("should return the hours in 12-hour format if passed `false` as a parameter", function() {
      var datetime = new DateTime(2012,12,21,21,30);
      datetime.getHours(false).should.equal(9);
    });
    it("should return the hours in 24-hour format if passed `true` as a parameter", function() {
      var datetime = new DateTime(2012,12,21,21,30);
      datetime.getHours(true).should.equal(21);
    });
  });
});