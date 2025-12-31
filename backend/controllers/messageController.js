import { PrismaClient } from "@prisma/client";
import { getReceiverSocketId, io } from "../socket/socket.js";

const prisma = new PrismaClient();

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = parseInt(req.params.id);
        const { content } = req.body;

        const newMessage = await prisma.message.create({
            data: { content, senderId, receiverId },
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userToChatId = parseInt(req.params.id);
        const senderId = req.user.id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: senderId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: senderId },
                ],
            },
            orderBy: { createdAt: "asc" },
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const { content } = req.body;

        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: { content },
        });

        const receiverSocketId = getReceiverSocketId(updatedMessage.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("updateMessage", updatedMessage);
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Update failed" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const message = await prisma.message.findUnique({ where: { id: messageId } });
        if (!message) return res.status(404).json({ error: "Not found" });

        const receiverId = message.receiverId;
        await prisma.message.delete({ where: { id: messageId } });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("deleteMessage", messageId);
        }

        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Delete failed" });
    }
};
