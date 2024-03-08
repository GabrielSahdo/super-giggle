import { hash } from "bcrypt";
import { randomUUID } from "crypto";

import { UserRepository } from "../repositories/user.repository.js";

export class AuthService {
    constructor({ userRepository }) {
        /** @type {UserRepository} */
        this.userRepository = userRepository;
        this.saltRounds = 10;
    }

    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<FunctionReturn>}
     */
    async register(username, password) {
        try {
            if (await this.userRepository.getByUsername(username)) {
                return { error: "Username already exists" };
            }
    
            const { value: hashedPassword, error } = await this.hashPassword(password);

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

    async hashPassword(password) {
        try {
            const hashedPassword = await hash(password, this.saltRounds);
            return { value: hashedPassword };
        } catch (error) {
            return { error: error.message };
        }
    }
}