module.exports = {
  test: describe("env: check", () => {
    it('should return "test" as NODE_ENV', () => {
      expect(process.env.NODE_ENV).toBe("test");
    });
  })
};
