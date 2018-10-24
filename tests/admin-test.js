const request = require("supertest");
const app = require("../app");

const adminData = {
  userName: "admin",
  password: "123456"
};

const postAdmin = (url, payload) => {
  return request(app)
    .post(url)
    .send(payload);
};

const test = describe("route: admin", () => {
  it("should add a new admin acccount", () => {
    return postAdmin("/admin", adminData).then(response => {
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("_id");
    });
  });

  it("should NOT create a new admin account with duplicate name", () => {
    return postAdmin("/admin", adminData).then(response => {
      expect(response.status).toBe(500);
    });
  });

  it("should log valid admin account in", () => {
    return postAdmin("/admin/signin", adminData).then(response => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });

  it("should NOT log in unregistered account", () => {
    return postAdmin("/admin/signin", {
      userName: "somerandomuser",
      password: "1234"
    }).then(response => {
      expect(response.status).toBe(500);
    });
  });

  it("should NOT log in if password is incorrect", () => {
    return postAdmin("/admin/signin", {
      userName: "admin",
      password: "incorrectpassword"
    }).then(response => {
      expect(response.status).toBe(500);
    });
  });
});

module.exports = test;
