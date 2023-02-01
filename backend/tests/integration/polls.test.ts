import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "../../src/app";
import { createUser } from "../factories/users-factory";
import { cleanDb } from "../helpers";
import * as jwt from "jsonwebtoken";
import { generateValidToken } from "../factories/sessions-factory";
import { prisma } from "../../src/config/database";
import { generateValidPoll, generateValidPollBody } from "../factories/polls.factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("POST /polls", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/polls");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.post("/polls").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ user_id: userWithoutSession.id }, process.env.JWT_SECRET);
        
        const response = await server.post("/polls").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 400 when body is not present", async () => {
            const token = await generateValidToken();
      
            const response = await server.post("/polls").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
        

        it("should respond with status 400 when body is not valid", async () => {
            const token = await generateValidToken();
            const body = { [faker.lorem.word()]: faker.lorem.word() };
    
            const response = await server.post("/polls").set("Authorization", `Bearer ${token}`).send(body);
    
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when body is valid", () => {

            it("should respond with status 201 and create new poll", async () => {
                const user = await createUser();
                const body = generateValidPollBody();
                const token = await generateValidToken(user);
        
                const response = await server.post("/polls").set("Authorization", `Bearer ${token}`).send(body);
        
                expect(response.status).toBe(httpStatus.CREATED);
                const poll = await prisma.polls.findFirst({ where: { user_id:user.id } });
                expect(poll).toBeDefined();
            });
        });
    });
});

describe("DELETE /polls", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.delete("/polls/1");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.delete("/polls/1").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ user_id: userWithoutSession.id }, process.env.JWT_SECRET);
        
        const response = await server.delete("/polls/1").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 400 when poll_id is invalid", async () => {
            const token = await generateValidToken();
      
            const response = await server.delete("/polls/"+faker.lorem.word()).set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
        

        it("should respond with status 400 when poll_id is out of bounds", async () => {
            const token = await generateValidToken();
    
            const response = await server.delete("/polls/0").set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when poll doesn't exist", async () => {
            const token = await generateValidToken();
    
            const response = await server.delete("/polls/1").set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        describe("when poll exists", () => {

            it("should respond with status 401 when poll doesn't belong to user", async () => {
                const user = await createUser()
                const token = await generateValidToken(user);
                const poll = await generateValidPoll();
        
                const response = await server.delete(`/polls/${poll.id}`).set("Authorization", `Bearer ${token}`);
        
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
            });

            it("should respond with status 200 and delete poll", async () => {
                const user = await createUser()
                const token = await generateValidToken(user);
                const poll = await generateValidPoll(user);
                const poll_count_before = await prisma.polls.count();

                const response = await server.delete(`/polls/${poll.id}`).set("Authorization", `Bearer ${token}`);
                const poll_count_after = await prisma.polls.count();
        
                expect(response.status).toBe(httpStatus.OK);
                expect(poll_count_before).toEqual(1);
                expect(poll_count_after).toEqual(0);
            });
        });
    });
});