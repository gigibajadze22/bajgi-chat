import express from "express";
import { updateUser, deleteUser, getMe ,getUsersForSidebar} from "../controllers/userController.js";
import { auth} from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.route('/me').get(auth, getMe);
userRouter.route('/update-me').post(auth,upload.single('profilePic'), updateUser);
userRouter.route('/delete-me').delete(auth, deleteUser);
userRouter.get("/all", auth, getUsersForSidebar);

export default userRouter;