import { Database } from "../database.js";
import { User } from "../entities/user.model.js";

export class UserRepository {
    constructor({ database }) {
        /** @type {Database} */
        this.database = database;
    }

    async getByUsername(username) {
        const user = await User.findOne({ where: { username } });

        return user ? user.toJSON() : null;
    }

    async create({ id, username, hashedPassword }) {
        const user = await User.create({ id, username, hashedPassword });

        return user;
    }
}