import supertest from "supertest";
import { expect } from "chai";
import userModel from "../src/models/user.model.js";
import { generateToken } from "../src/utils.js";
const requester = supertest("http://localhost:3000");

describe("Test modulo Sessions", () => {
    beforeEach(async function () {
        await userModel.deleteMany({});
    });

    it("El endpoint POST /api/sessions/register registra un Usuario correctamente", async () => {
        const userMock = {
            first_name: "Pedro",
            last_name: "Garcia",
            email: "pedro.garcia@gmail.com",
            age: 35,
            password: "1234",
            cart: [],
            role: "ADMIN",
        };
        const result = await requester
            .post("/api/sessions/register")
            .send(userMock);
        const { statusCode, body } = result;

        expect(statusCode).to.be.equal(200);
        expect(body.status).to.be.equal("success");
    });

    it("El endpoint POST /api/sessions/login loguea un Usuario correctamente", async () => {
        const userMock = {
            email: "pedro.garcia@gmail.com",
            password: "1234",
        };
        const responseLogin = await requester
            .post("/api/sessions/login")
            .send(userMock);
        
        const { body } = responseLogin;
        expect(body.status).to.be.equal("success");
        expect(body).to.have.property("token");
    });

    it("El endpoint GET /api/sessions/current obtiene el Usuario", async () => {
        const userMock = {
            first_name: "Pedro",
            last_name: "Garcia",
            email: "pedro.garcia@gmail.com",
            age: 35,
            password: "1234",
            cart: [],
            role: "ADMIN",
        };
        const token = generateToken(userMock);

        const responseCurrent = await requester
            .get("/api/sessions/current")
            .set("Authorization", `Bearer ${token}`);

        const { body } = responseCurrent;
        expect(body.status).to.be.equal("success");
        expect(body.payload.email).to.be.equal("pedro.garcia@gmail.com");
    });
});
