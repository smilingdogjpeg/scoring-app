import request from "supertest";
import app from "../index.js";

describe("Game API", () => {
  let gameId;

  test("POST /api/games → should create a new game", async () => {
    const res = await request(app)
      .post("/api/games")
      .send({ name: "Friday Challenge" });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Friday Challenge");
    gameId = res.body.id;
  });

  test("GET /api/games → should return an array of games", async () => {
    const res = await request(app).get("/api/games");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/games/:id → should return a single game", async () => {
    const res = await request(app).get(`/api/games/${gameId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(gameId);
  });

  test("DELETE /api/games/:id → should delete a game", async () => {
    const res = await request(app).delete(`/api/games/${gameId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
