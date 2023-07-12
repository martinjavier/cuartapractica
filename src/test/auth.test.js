import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import { createHash, isValidPassword } from "../utils.js";

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Authentication", () => {
  before(async function () {});

  it("Review effective hash process", async function () {
    const passwordLogin = "1234";
    const efectiveHash =
      /(?=[A-Za-z0-9@#$%/^.,{}&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g;
    const passwordHash = await createHash(passwordLogin);
    expect(efectiveHash.test(passwordHash)).to.be.equal(true);
  });

  it("Compare the password hash with the original password", async function () {
    const passwordLogin = "1234";
    const passwordHash = await createHash(passwordLogin);
    const mockUser = {
      email: "martin@gmail.com",
      password: passwordHash,
    };
    const result = await isValidPassword(mockUser, passwordLogin);
    expect(result).to.be.equal(true);
  });

  it("Verify if password hash is modified the comparison with the original password hash must return false", async function () {
    const passwordLogin = "1234";
    const passwordHash = await createHash(passwordLogin);
    const mockUser = {
      email: "martin@gmail.com",
      password: passwordHash + "ga786",
    };
    const result = await isValidPassword(mockUser, passwordLogin);
    expect(result).to.be.equal(false);
  });
});
