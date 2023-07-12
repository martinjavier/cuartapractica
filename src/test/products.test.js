import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import { createHash, isValidPassword } from "../utils.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Product Manager", () => {
  before(async function () {});

  it("Get all existing products", async function () {
    const response = await requester.get("/api/products");
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.have.property("status");
  });

  it("Create a new Product", async function () {
    const mockProduct = {
      title: "producto70",
      description: "desc70",
      price: 7000,
      thumbnail: "7000",
      code: "7000",
      stock: 7000,
      status: true,
      category: "Ropa",
    };
    const result = await requester.post("/api/products").send(mockProduct);
    expect(result.statusCode).to.be.equal(500);
  });
});
