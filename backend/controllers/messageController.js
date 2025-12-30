import { PrismaClient } from "@prisma/client";
import { getReceiverSocketId, io } from "../socket/socket.js";

const prisma = new PrismaClient();

export const sendMessage = async (req, res, next) => {
	try {
		const senderId = req.user.id;
		const receiverId = parseInt(req.params.id);
		const { content } = req.body;

		const newMessage = await prisma.message.create({
			data: { content, senderId, receiverId },
		});

		const receiverSocketId = getReceiverSocketId(String(receiverId));
		if (receiverSocketId) {
			// აგზავნის პირდაპირ მესიჯს
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage); // ვაბრუნებთ პირდაპირ ობიექტს
	} catch (error) {
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
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const updateMessage = async (req, res, next) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) return next(new AppError("მესიჯი ვერ მოიძებნა", 404));

    if (message.senderId !== userId) {
      return next(new AppError("თქვენ არ გაქვთ ამ მესიჯის განახლების უფლება", 403));
    }
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
    res.status(200).json({
      status: "success",
      data: { message: updatedMessage },
    });
  } catch (error) {
    console.log(error);
    next(new AppError("მესიჯის განახლება ვერ მოხერხდა", 500));
  }
};
export const deleteMessage = async (req, res, next) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.id;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) return next(new AppError("მესიჯი ვერ მოიძებნა", 404));
    if (message.senderId !== userId) {
      return next(new AppError("თქვენ არ გაქვთ ამ მესიჯის წაშლის უფლება", 403));
    }
    await prisma.message.delete({
      where: { id: messageId },
    });
    res.status(200).send({
      status: "success",
      message: "მესიჯი წარმატებით წაიშალა",
      data: null,
    });
  }
  catch (error) {
    next(new AppError("მესიჯის წაშლა ვერ მოხერხდა", 500));
  }
};