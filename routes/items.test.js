process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");

let item = { name: "silly", price: 200 };

beforeEach(async () => {
  items.push(item);
});

afterEach(async () => {
  items.length = 0;
});

// GET /items
describe("GET /items", function () {
  test("Gets a list of items", async function () {
    const response = await request(app).get("/items");
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toHaveLength(1);
  });
});

// GET /items/:name
describe("GET /items/:name", function () {
  test("Gets a single item", async function () {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(item);
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).get("/items/0");
    expect(response.statusCode).toBe(404);
  });
});

// POST /items
describe("POST /items", function () {
  test("Creates a new item", async function () {
    const response = await request(app)
      .post("/items")
      .send({ name: "Taco", price: 0 });

    expect(response.statusCode).toBe(200);
    expect(response.body.item.name).toEqual("Taco");
    expect(response.body.item.price).toEqual(0);
  });
});

// PATCH /items/:name
describe("PATCH /items/:name", function () {
  test("Updates a single item", async function () {
    const response = await request(app)
      .patch(`/items/${item.name}`)
      .send({ name: "Troll" });

    expect(response.statusCode).toBe(200);
    expect(response.body.item.name).toEqual("Troll");
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).patch("/items/0");
    expect(response.statusCode).toBe(404);
  });
});

// DELETE /items/:name
describe("DELETE /items/:name", function () {
  test("Deletes a single item", async function () {
    const response = await request(app).delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" });
  });
});
