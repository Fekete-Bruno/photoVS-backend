import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "../../src/app";
import { createUser } from "../factories/users-factory";
import { cleanDb } from "../helpers";
import * as jwt from "jsonwebtoken";
import { generateValidToken } from "../factories/sessions-factory";
import { prisma } from "../../src/config/database";
import { generateValidPoll } from "../factories/polls.factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("POST /votes", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/votes");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.post("/votes").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ user_id: userWithoutSession.id }, process.env.JWT_SECRET);
        
        const response = await server.post("/votes").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 400 when body is not present", async () => {
            const token = await generateValidToken();
      
            const response = await server.post("/votes").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
        

        it("should respond with status 400 when body is not valid", async () => {
            const token = await generateValidToken();
            const body = { [faker.lorem.word()]: faker.lorem.word() };
    
            const response = await server.post("/votes").set("Authorization", `Bearer ${token}`).send(body);
    
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when body is valid", () => {
            const generateValidVoteBody = (user_id:number, poll_id:number) => ({
                voted_for_a: faker.datatype.boolean(),
                user_id,
                poll_id
            });
            
            it("should respond with status 404 if poll doesn't exist", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const body = generateValidVoteBody(user.id,1);
        
                const response = await server.post("/votes").set("Authorization", `Bearer ${token}`).send(body);
        
                expect(response.status).toBe(httpStatus.NOT_FOUND);
            });

            it("should respond with status 201 and create new vote", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const poll = await generateValidPoll(user);
                const body = generateValidVoteBody(user.id,poll.id);
        
                const response = await server.post("/votes").set("Authorization", `Bearer ${token}`).send(body);
        
                expect(response.status).toBe(httpStatus.CREATED);
                const vote = await prisma.votes.findFirst({ where: { user_id:user.id } });
                expect(vote).toBeDefined();
            });
        });
    });
});