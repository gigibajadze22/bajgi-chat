import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/errorhandler.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const prisma = new PrismaClient();

export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return next(new AppError("გთხოვთ შეავსოთ ყველა ველი", 400));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError("მომხმარებელი ამ მეილით უკვე არსებობს", 409));
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashPassword,
        role: "user",
      },
    });

    user.password = undefined;

    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(new AppError("მომხმარებლის შექმნა ვერ მოხერხდა", 500));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(new AppError("გთხოვთ მიუთითოთ მეილი და პაროლი", 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("მეილი ან პაროლი არასწორია", 401));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
    });

    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    next(new AppError("ავტორიზაცია ვერ მოხერხდა", 500));
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError("მომხმარებელი ვერ მოიძებნა", 404));
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e4e8; padding: 40px; border-radius: 12px; color: #24292e;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a73e8; margin: 0; font-size: 28px; font-weight: 700;">BAJGI</h1>
          <p style="color: #586069; font-size: 14px; margin-top: 5px;">უსაფრთხო ავტორიზაციის სისტემა</p>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 600; color: #1b1f23; text-align: center;">პაროლის აღდგენის მოთხოვნა</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #444; text-align: center;">
          თქვენ მიიღეთ ეს შეტყობინება, რადგან მოითხოვეთ პაროლის განახლება BAJGI-ს პლატფორმაზე. 
          გთხოვთ, გამოიყენოთ ქვემოთ მოცემული ერთჯერადი კოდი (OTP):
        </p>
        
        <div style="background-color: #f6f8fa; border: 1px solid #d1d5da; padding: 20px; margin: 30px 0; text-align: center; border-radius: 8px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a73e8;">${otpCode}</span>
        </div>
        
        <p style="font-size: 13px; color: #6a737d; text-align: center; margin-top: 20px;">
          კოდი აქტიურია <strong>15 წუთის</strong> განმავლობაში.<br>
          თუ ეს მოთხოვნა თქვენ არ გეკუთვნით, უბრალოდ უგულებელყავით ეს წერილი.
        </p>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaecef; font-size: 12px; color: #959da5;">
          <p>&copy; ${new Date().getFullYear()} BAJGI Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"BAJGI Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "BAJGI - პაროლის აღდგენის კოდი",
      html: htmlContent,
    });

    await prisma.user.update({
      where: { email },
      data: {
        otpCode,
        otpexpiry: otpExpiry,
      },
    });

    res.status(200).json({ message: "OTP კოდი გამოგზავნილია მეილზე" });
  } catch (error) {
    next(new AppError("შეცდომა პაროლის აღდგენის მოთხოვნისას", 500));
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otpCode, newPassword } = req.body;
  
  console.log("Reset attempt for:", email); // Debug
  console.log("Received OTP:", otpCode);     // Debug

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("User not found");
      return next(new AppError("User not found", 404));
    }

    // ვბეჭდავთ დროს რომ შევადაროთ
    console.log("DB OTP:", user.otpCode);
    console.log("DB Expiry:", user.otpexpiry);
    console.log("Current Time:", new Date());

    if (user.otpCode !== otpCode) {
      return next(new AppError("Invalid code", 400));
    }

    if (new Date() > user.otpexpiry) {
      return next(new AppError("Code has expired", 400));
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashPassword,
        otpCode: null,
        otpexpiry: null,
      },
    });

    res.status(200).json({ status: "success", message: "Password updated!" });
  } catch (error) {
    console.error("PRISMA ERROR:", error); // ეს დაგიწერს ტერმინალში ზუსტ შეცდომას
    next(new AppError("Database update failed", 500));
  }
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 }); // ვშლით ქუქის
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};