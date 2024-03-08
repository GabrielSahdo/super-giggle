import Express from "express";
import { DatabaseFactory } from "./factories/database.factory.js";
import { AuthRouterFactory } from "./factories/authRouter.factory.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";

const PORT = 3000;
const dbFilePath = "../database/database.sqlite";
const app = Express();

const database = await DatabaseFactory.init({dbFilePath});

app.use(Express.json());
app.use("/auth", AuthRouterFactory.init({ database }));
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});