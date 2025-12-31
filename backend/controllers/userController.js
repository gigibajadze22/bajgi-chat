import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorhandler.js";

const prisma = new PrismaClient();

export const updateUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "ავტორიზაცია საჭიროა" });
    }
    const userId = req.user.id;
    const { fullName } = req.body; // ვიყენებთ fullName-ს

    const updateData = {};
    if (fullName) updateData.fullName = fullName;

    if (req.file) {
      // მნიშვნელოვანია: ვიყენებთ filename-ს და არა path-ს
      updateData.profilePic = req.file.filename; 
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    updatedUser.password = undefined;

    // ვაბრუნებთ პირდაპირ ობიექტს, რადგან Profile.jsx ასე ელოდება
    res.status(200).json(updatedUser); 

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "მონაცემების განახლება ვერ მოხერხდა" });
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("ავტორიზაცია საჭიროა", 401));
    }
    const userId = req.user.id;
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError("მომხმარებლის წაშლა ვერ მოხერხდა", 500));
  }
};
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return next(new AppError("მომხმარებელი ვერ მოიძებნა", 404));

    user.password = undefined;

    // სურათის URL-ის დაგენერირება
    if (user.profilePic && !user.profilePic.startsWith("http")) {
      user.profilePic = `http://localhost:3000/uploads/${user.profilePic}`;
    }

    res.status(200).json({
      status: "success",
      data: { user }, // აქ აბრუნებს ობიექტს { data: { user } }
    });
  } catch (error) {
    next(new AppError("შეცდომა", 500));
  }
};
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const allUsers = await prisma.user.findMany({
            where: { id: { not: loggedInUserId } },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });

        // თითოეული იუზერისთვის სურათის URL-ის ფორმირება
        const usersWithImages = allUsers.map(user => ({
            ...user,
            profilePic: user.profilePic && !user.profilePic.startsWith("http")
                ? `http://localhost:3000/uploads/${user.profilePic}`
                : user.profilePic
        }));

        res.status(200).json(usersWithImages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};