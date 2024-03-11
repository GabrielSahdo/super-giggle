import { Database } from "../misc/database.js";

export class DatabaseFactory {
    static async init({ dbFilePath }) {
        const database = new Database({ dbFilePath });

        try {
            await database.authenticate();
            await database.initializeModels();
            await database.sync();
            console.log("Connection has been established successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }

        return database;
    }
}
