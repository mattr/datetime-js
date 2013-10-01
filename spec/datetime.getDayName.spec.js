var should = chai.should();

describe("DateTime", function() {
  describe("#getDayName", function() {
    it("should return the day of the week", function() {
      var datetime = new DateTime(2012,12,12);
      datetime.getDayName().should.equal("Wednesday");
    });
    it("should abbreviate the day of the week if passed `true` as a parameter", function() {
      var datetime = new DateTime(2012,12,12);
      datetime.getDayName(true).should.equal("Wed");
    });
  }); // #getDayName
  describe("#dayName", function() {
    it("should function as an alias for #getDayName", function() {
      var datetime = new DateTime(2012,12,12);
      datetime.dayName().should.equal("Wednesday");
      datetime.dayName(true).should.equal("Wed");
    });
  }); // #dayName  
});