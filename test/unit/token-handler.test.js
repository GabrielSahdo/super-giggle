import { expect } from "chai";
import { decodeToken, generateToken } from "../../src/misc/token-handler.js";

describe("TokenHandler", () => {
    describe("generateToken", () => {
        const secret = "mySecretKey";

        it("should return a token", () => {
            const [error, value] = generateToken({ userId: 123 }, secret, "1h");

            expect(error).to.be.null;
            expect(value).to.be.a("string");
        });

        it("should return an error if an exception is thrown", () => {
            const [error, value] = generateToken(
                { userId: 123 },
                secret,
                "invalid"
            );

            expect(error).to.be.a("string");
            expect(value).to.be.null;
        });
    });

    describe("decodeToken", () => {
        const secret = "mySecretKey";

        it("should return the decoded token value", () => {
            const [_, token] = generateToken({ userId: 123 }, secret, "1h");
            const [error, value] = decodeToken(token, secret);

            expect(error).to.be.null;
            expect(value).to.have.property("data");
            expect(value).to.have.property("iat");
            expect(value).to.have.property("exp");
            expect(value.data).to.deep.equal({ userId: 123 });
        });

        it("should return an error if the token has expired", () => {
            const [_, expiredToken] = generateToken(
                { userId: 123 },
                secret,
                "0s"
            );
            const [error, value] = decodeToken(expiredToken, secret);

            expect(error).to.equal("Token has expired");
            expect(value).to.be.null;
        });

        it("should return an error if the token is invalid", () => {
            const invalidToken = "invalidToken";
            const [error, value] = decodeToken(invalidToken, secret);

            expect(error).to.equal("Invalid Token");
            expect(value).to.be.null;
        });
    });
});
