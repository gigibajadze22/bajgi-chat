import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"
import { AppError, handleError } from './utils/errorhandler.js'
import authRouter from './Routes/authRouter.js'
import userRouter from './Routes/userRouter.js'
import messageRouter from './Routes/messageRouter.js'
import { app, server } from "./socket/socket.js" 

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/bajgi", authRouter)
app.use('/bajgi/users', userRouter)
app.use('/bajgi/messages', messageRouter)

app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(handleError)

server.listen(3000, () => {
    console.log('server is running on port 3000')
})