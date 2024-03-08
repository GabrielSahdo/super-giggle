import { Sequelize } from "sequelize";
import Models from "./entities/index.js";

export class Database {
    constructor({ dbFilePath }) {
        this.dbFilePath = dbFilePath;

        this.connection = new Sequelize({
            dialect: "sqlite",
            storage: dbFilePath,
            logging: false
        });

        this.models = {};
    }

    async authenticate() {
        await this.connection.authenticate();
    }

    async initializeModels() {
        const models = Object.values(Models);

        models.forEach((model) => model.init && model.init(this.connection));
        models.forEach((model) => model.associate && model.associate(this.connection.models));

        this.models = this.connection.models;
    }

    async sync() {
        await this.connection.sync({ force: true });
    }
}