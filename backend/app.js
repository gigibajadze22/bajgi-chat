import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRouter from './Routes/authRouter.js';
import userRouter from './Routes/userRouter.js';
import messageRouter from './Routes/messageRouter.js';
import { app, server } from "./socket/socket.js"; 
import { AppError, handleError } from './utils/errorhandler.js';

app.use(express.json());
app.use(cookieParser());

// CORS კონფიგურაცია
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use('/uploads', express.static('uploads'));
// როუტები (აუცილებლად /bajgi პრეფიქსით, რომ პროქსიმ დაიჭიროს)
app.use("/bajgi/auth", authRouter);
app.use('/bajgi/users', userRouter);
app.use('/bajgi/messages', messageRouter);

// 404 შეცდომა
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// გლობალური ერორ ჰენდლერი
app.use(handleError);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});