import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorhandler.js";

const auth = (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers["authorization"]?.split(' ')[1];

        if (!token) {
            return next(new AppError("No token provided", 401));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return next(new AppError("Token has expired", 401));
                }
                return next(new AppError("Failed to authenticate token", 401));
            }

            // მნიშვნელოვანი: ნახე შენი Login-ის დროს ტოკენში 'id' ჩაწერე თუ 'userId'
            // თუ Login-ში გაქვს jwt.sign({ userId: user.id }, ...), მაშინ აქ უნდა ეწეროს decoded.userId
            req.user = decoded; 
            
            console.log("ავტორიზებული იუზერის მონაცემები:", req.user);
            next();
        });
    } catch (error) {
        console.error("Auth Middleware-ის შეცდომა:", error);
        next(new AppError("სერვერის შიდა შეცდომა ავტორიზაციისას", 500));
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(new AppError("Forbidden", 403));
    }
    next();
};

export { auth, isAdmin };