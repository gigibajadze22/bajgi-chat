import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorhandler.js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const updateUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("ავტორიზაცია საჭიროა", 401));
    }
    const userId = req.user.id;
    const { name, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (req.file) {
      // Delete old profile picture if exists
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (existingUser && existingUser.profilePic) {
        fs.unlink(path.resolve(existingUser.profilePic), (err) => {
          if (err) console.error("Failed to delete old profile picture:", err);
        });
      }
      updateData.profilePic = req.file.path; // Save the file path
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    updatedUser.password = undefined;
    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  }
  catch (error) {
    next(new AppError("მომხმარებლის განახლება ვერ მოხერხდა", 500));
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
    if (!req.user || !req.user.id) {
      return next(new AppError("ავტორიზაცია საჭიროა", 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return next(new AppError("მომხმარებელი ვერ მოიძებნა", 404));
    }

    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(new AppError("მონაცემების მიღება ვერ მოხერხდა", 500));
  }
};
export const getUsersForSidebar = async (req, res, next) => {
    try {
        // შემოწმება: თუ req.user საერთოდ არ არსებობს
        if (!req.user || !req.user.id) {
            return next(new AppError("User not authenticated correctly", 401));
        }

        const loggedInUserId = req.user.id;

        const allUsersExceptMe = await prisma.user.findMany({
            where: {
                id: {
                    not: loggedInUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
                email: true,
            },
        });

        res.status(200).json({
            status: "success",
            data: { users: allUsersExceptMe },
        });
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        next(new AppError("იუზერების წამოღება ვერ მოხერხდა ბაზიდან", 500));
    }
};