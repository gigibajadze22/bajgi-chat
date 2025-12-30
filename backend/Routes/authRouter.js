import express from 'express';

import { signup,login,forgotPassword ,resetPassword,logout} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.route('/signup').post(signup);
authRouter.route('/login').post(login);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password').post(resetPassword);
authRouter.route('/logout').post(logout);
export default authRouter;