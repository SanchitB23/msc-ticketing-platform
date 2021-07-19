import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string,
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const CurrentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        console.log("no jwt")
        return next()
    }
    try {
        req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
    } catch (e) {
        console.log("wrong jwt")
        return res.send({currentUser: null})
    } finally {
        next()
    }
}
