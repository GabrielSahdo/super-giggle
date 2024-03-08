import { UserRepository } from "../repositories/user.repository.js";
import { AuthRouter } from "../router/auth.router.js";
import { AuthService } from "../services/auth.service.js";

export class AuthRouterFactory {
    static init({ database }) {
        const userRepository = new UserRepository({ database });
        const authService = new AuthService({ userRepository });
        return AuthRouter({ authService });
    }
}