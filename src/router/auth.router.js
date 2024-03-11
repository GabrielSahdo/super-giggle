import { Router } from "express";
import { AuthService } from "../services/auth.service.js";

/**
 * @param {Object} param0
 * @param {AuthService} param0.authService
 */
export const AuthRouter = ({ authService }) => {
    return Router()
        .post("/register", async (req, res, next) => {
            const { username, password } = req.body;

            const { error, value: userId } = await authService.register(
                username,
                password
            );

            if (error) {
                return next(new Error(error));
            }

            res.json({ userId });
        })
        .post("/login", async (req, res, next) => {
            const { username, password } = req.body;

            const { error, value: token } = await authService.login(
                username,
                password
            );

            if (error) {
                return next(new Error(error));
            }

            res.json({ token });
        });
};
