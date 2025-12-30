import express from "express";
import { sendMessage, getMessages ,updateMessage,deleteMessage} from "../controllers/messageController.js";
import { auth } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.use(auth);

messageRouter.get("/:id", getMessages);
messageRouter.post("/send/:id", sendMessage);
messageRouter.post("/update/:id", updateMessage);
messageRouter.delete("/delete/:id", deleteMessage);

export default messageRouter;