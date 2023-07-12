import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import { createHash, isValidPassword } from "../utils.js";
import { CartManager } from "../dao/factory.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Cart Manager", () => {
  before(async function () {});

  it("Get all existing carts", async function () {
    const response = await requester.get("/api/carts");
    expect(response.body).to.have.property("status");
    expect(Array.isArray(response.body.payload)).to.deep.equal(true);
  });

  it("Create a new cart with a product", async function () {
    const mockCart = {
      products: [{ id: "642c517ccbcc6f6acabf0a54", quantity: 500 }],
    };
    const result = await requester.post("/api/carts").send(mockCart);
    expect(result.statusCode).to.be.equal(200);
  });

  it("Create a new cart with many products", async function () {
    const mockCart = {
      products: [
        { id: "649350002fee8fd1ce51e597", quantity: 50 },
        { id: "649771d41d6286f577217af9", quantity: 50 },
        { id: "64934f532fee8fd1ce51e596", quantity: 50 },
      ],
    };
    const result = await requester.post("/api/carts").send(mockCart);
    expect(result.statusCode).to.be.equal(200);
  });
});
