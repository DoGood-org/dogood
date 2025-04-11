const request = require("supertest");
const app = require("../server"); // export app in server.js if not yet
const mongoose = require("mongoose");

describe("POST /api/posts", () => {
  it("should reject unauthenticated post creation", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "Test",
      content: "Test content",
    });

    expect(res.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
