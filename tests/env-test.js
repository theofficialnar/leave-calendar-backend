module.exports = {
  test: describe("env: check", () => {
    it('should return "test" as NODE_ENV', done => {
      expect(process.env.NODE_ENV).toBe("test");
      done();
    });
  })
};
