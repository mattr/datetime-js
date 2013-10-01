var should = chai.should();

describe("DateTime", function() {
  describe("#getMonthName", function() {
    it("should return the name of the month specified by the #month attribute", function() {
      var datetime = new DateTime(2013,12);
      datetime.getMonthName().should.equal("December");
    });
    it("should abbreviate the month name if `true` is passed as parameter", function() {
      var datetime = new DateTime(2013,12);
      datetime.getMonthName(true).should.equal("Dec");
    });
  }); // #getMonthName
  describe("#monthName", function() {
    it("should function as an alias for #getMonthName", function() {
      var datetime = new DateTime(2013,2);
      datetime.monthName().should.equal("February");
      datetime.monthName(true).should.equal("Feb");
    });
  }); // #monthName
});