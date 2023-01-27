import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/users-factory";
import { duplicatedEmailError, duplicatedUsernameError } from "../../src/errors/users-errors";

beforeAll(async () => {
    await init();
    await cleanDb();
})

const server = supertest(app);

describe("POST /users", ()=>{
    it("should respond with status 400 when body is not given", async () => {
        const response = await server.post("/users");

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid",async () => {
        const invalid_body = { [faker.lorem.word()]: faker.lorem.word() };

        const response = await server.post("/users").send(invalid_body);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
        const generateValidBody = () => ({
          email: faker.internet.email(),
          password: faker.internet.password(6),
        });

        it("should respond with status 409 when there is an user with given email", async () => {
            const body = generateValidBody();
            await createUser(body);
    
            const response = await server.post("/users").send(body);
    
            expect(response.status).toBe(httpStatus.CONFLICT);
            expect(response.body).toEqual(duplicatedEmailError());
        });

        it("should respond with status 409 when there is an user with given username", async () => {
            const body = generateValidBody();
            await createUser(body);
    
            const response = await server.post("/users").send(body);
    
            expect(response.status).toBe(httpStatus.CONFLICT);
            expect(response.body).toEqual(duplicatedUsernameError());
        });


        it("should respond with status 201 and create user when given email is unique", async () => {
            const body = generateValidBody();
    
            const response = await server.post("/users").send(body);
    
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual({
              id: expect.any(Number),
              email: body.email,
            });
        });
        
    
    });

});