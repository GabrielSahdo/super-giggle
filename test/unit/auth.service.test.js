import { expect } from "chai";
import { AuthService } from "../../src/services/auth.service.js";
import e from "express";

describe("AuthService", () => {
    /** @type {AuthService} */
    let authService;

    beforeEach(() => {
        // Create a mock userRepository object for testing
        const userRepository = {
            getByUsername: () => {},
            create: () => {},
        };

        authService = new AuthService({ userRepository });
    });

    describe("hashPassword", () => {
        it("should return the hashed password", async () => {
            const result = await authService.hashPassword("password");

            expect(result).to.have.property("value");
            expect(result.value).to.be.a("string");
            expect(result).to.not.have.property("error");
        });

        it("should return an error if an exception is thrown", async () => {
            authService.saltRounds = "invalid";

            const result = await authService.hashPassword("password");

            expect(result).to.have.property("error");
            expect(result).to.not.have.property("value");
            expect(result.error).to.be.a("string");
        });
    });

    describe("register", () => {
        it("should return an error if username already exists", async () => {
            // Mock the getByUsername method to return a truthy value
            authService.userRepository.getByUsername = () => true;

            const result = await authService.register("testuser", "password");

            expect(result).to.deep.equal({ error: "Username already exists" });
        });

        it("should return the user ID if registration is successful", async () => {
            // Mock the getByUsername method to return a falsy value
            authService.userRepository.getByUsername = () => false;

            // Mock the create method to return a resolved promise
            authService.userRepository.create = () => Promise.resolve();

            const result = await authService.register("testuser", "password");

            expect(result).to.have.property("value");
            expect(result.value).to.be.a("string");
        });

        it("should return an error if an exception is thrown", async () => {
            // Mock the getByUsername method to throw an error
            authService.userRepository.getByUsername = () => {
                throw new Error("Database error");
            };

            const result = await authService.register("testuser", "password");

            expect(result).to.deep.equal({ error: "Database error" });
        });
    });

    describe("generateToken", () => {
        it("should return an error if userId or username is missing", () => {
            const [error, value] = authService.generateToken();
            expect(error).to.equal("userId and username are required");
            expect(value).to.be.null;
        });

        it("should return a token if userId and username are provided", () => {
            const [error, token] = authService.generateToken("123", "testuser");
            expect(error).to.be.null;
            expect(token).to.be.a("string");
        });
    });
});
