import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "../../src/app";
import { createUser } from "../factories/users-factory";
import { cleanDb, generateValidUser } from "../helpers";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("POST /auth/sign-in", () => {
    it("should respond with status 400 when body is not given", async () => {
        const response = await server.post("/auth/sign-in");
        
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
        const invalid_body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.post("/auth/sign-in").send(invalid_body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

    describe("when body is valid", () => {

        it("should respond with status 401 if there is no user for given email", async () => {
            const body = generateValidUser();
            delete body.username;
        
            const response = await server.post("/auth/sign-in").send(body);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
            const user = generateValidUser();
            await createUser(user);

            const response = await server.post("/auth/sign-in").send({
              email: user.email,
              password: faker.lorem.word(10),
            });
      
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should respond with status 400 if password is too small", async () => {
            const user = generateValidUser();
            await createUser(user);

            const response = await server.post("/auth/sign-in").send({
              email: user.email,
              password: faker.lorem.word(5),
            });
      
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when credentials are valid", () => {
            it("should respond with status 200", async () => {
                const user = generateValidUser();
                await createUser(user);

                delete user.username;

                const response = await server.post("/auth/sign-in").send(user);
        
                expect(response.status).toBe(httpStatus.OK);
            });

            it("should respond with user data", async () => {
                const user = generateValidUser();
                const created_user = await createUser(user);

                delete user.username;

                const response = await server.post("/auth/sign-in").send(user);

                expect(response.body.user).toEqual({
                    id: created_user.id,
                    email: user.email,
                    votes:[],
                });
            });

            it("should respond with session token",async () => {
                const user = generateValidUser();
                await createUser(user);

                delete user.username;

                const response = await server.post("/auth/sign-in").send(user);

                expect (response.body.token).toBeDefined();
            });
        });
    });
});
