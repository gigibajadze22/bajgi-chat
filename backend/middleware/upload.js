// upload profileimage


import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
  }
});
export const upload = multer({ storage: storage });
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
  } catch (error) {
    next(new AppError("მომხმარებლის განახლება ვერ მოხერხდა", 500));
  }
};