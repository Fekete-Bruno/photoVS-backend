import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../src/app";

const server = supertest(app);

describe("GET /health", ()=>{
    it("should respond with status 200 and correct text ", async() =>{
        const response = await server.get("/health");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.text).toBe("Connection is working!");
    });
});