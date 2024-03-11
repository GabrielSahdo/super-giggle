import JWT from "jsonwebtoken";

/**
 * @param {any} data
 * @param {string} secret
 * @param {string} expiresIn
 * @returns {[error, value]}
 */
export const generateToken = (data, secret, expiresIn) => {
    try {
        return [null, JWT.sign({ data }, secret, { expiresIn })];
    } catch (error) {
        return ["Unable to generate token", null];
    }
};

export const decodeToken = (token, secret) => {
    try {
        return [null, JWT.verify(token, secret)];
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return ["Token has expired", null];
        }

        return ["Invalid Token", null];
    }
};
