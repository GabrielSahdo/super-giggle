import { compare, hash } from "bcrypt";
import { randomUUID } from "crypto";

import { UserRepository } from "../repositories/user.repository.js";
import { decodeToken, generateToken } from "../misc/token-handler.js";

export class AuthService {
    constructor({ userRepository }) {
        /** @type {UserRepository} */
        this.userRepository = userRepository;
        this.saltRounds = 10;
        this.TOKEN_SECRET = "teste";
    }

    async hashPassword(password) {
        try {
            const hashedPassword = await hash(password, this.saltRounds);
            return { value: hashedPassword };
        } catch (error) {
            return { error: error.message };
        }
    }

    async comparePassword(password, hashedPassword) {
        try {
            const match = await compare(password, hashedPassword);
            return { value: match };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<{value: string}|{error: string}>}
     */
    async register(username, password) {
        try {
            if (await this.userRepository.getByUsername(username)) {
                return { error: "Username already exists" };
            }

            const { value: hashedPassword, error } = await this.hashPassword(
                password
            );

            if (error) return { error: hashError };

            const userId = randomUUID();

            await this.userRepository.create({
                id: userId,
                username,
                hashedPassword,
            });

            return { value: userId };
        } catch (error) {
            return { error: error.message };
        }
    }

    async login(username, password) {
        try {
            const user = await this.userRepository.getByUsername(username);

            if (!user) {
                return { error: "Invalid username or password" };
            }

            const { value: match, error } = await this.comparePassword(
                password,
                user.hashedPassword
            );

            if (error) return { error: error.message };

            if (!match) {
                return { error: "Invalid username or password" };
            }

            const { value: token } = this.generateToken(user.id, user.username);

            return { value: token };
        } catch (error) {
            return { error: error.message };
        }
    }


    generateToken(userId, username) {
        if (!userId || !username) {
            return ["userId and username are required", null];
        }

        try {
            const [err, token] = generateToken(
                { userId, username },
                this.TOKEN_SECRET,
                "1h"
            );

            if (err) {
                return [err, null];
            }

            return [null, token];
        } catch (error) {
            return [error.message, null];
        }
    }

    verifyToken(token) {
        try {
            const decoded = decodeToken(token, this.TOKEN_SECRET);
            return [null, decoded];
        } catch (error) {
            return [error.message, null];
        }
    }
}
