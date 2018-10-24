const request = require("supertest");
const app = require("../app");
const { clearDB } = require("./utils");

const adminData = {
  userName: "admin",
  password: "123456"
};

beforeAll(() => {
  return clearDB();
});

describe("Admin Route", () => {
  it("should add a new admin acccount", async () => {
    const response = await request(app)
      .post("/admin")
      .send(adminData);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("_id");
  });

  it("should NOT create a new admin account with duplicate name", async () => {
    const response = await request(app)
      .post("/admin")
      .send(adminData);
    expect(response.status).toBe(500);
  });

  it("should log valid admin account in", async () => {
    const response = await request(app)
      .post("/admin/signin")
      .send(adminData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
