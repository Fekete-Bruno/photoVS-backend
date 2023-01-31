import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "../../src/app";
import { createUser } from "../factories/users-factory";
import { cleanDb, generateValidUser } from "../helpers";
import * as jwt from "jsonwebtoken";
import { generateValidToken } from "../factories/sessions-factory";
import { prisma } from "../../src/config/database";

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
            const generateValidPollBody = (user_id: number) => ({
                title: faker.lorem.word(),
                description: faker.lorem.words(12),
                img_a_url: faker.image.image(),
                img_b_url: faker.image.image(),
                img_a_title: faker.lorem.word(),
                img_b_title: faker.lorem.word()
            });

            it("should respond with status 201 and create new poll", async () => {
                const user = await createUser();
                const body = generateValidPollBody(user.id);
                const token = await generateValidToken(user);
        
                const response = await server.post("/polls").set("Authorization", `Bearer ${token}`).send(body);
        
                expect(response.status).toBe(httpStatus.CREATED);
                const poll = await prisma.polls.findFirst({ where: { user_id:user.id } });
                expect(poll).toBeDefined();
            });
        });
    });
});