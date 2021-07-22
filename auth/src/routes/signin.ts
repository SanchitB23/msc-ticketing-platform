import express, {Request, Response} from "express";
import {body} from "express-validator";
import jwt from "jsonwebtoken";
import {BadRequestError, ValidateRequest,} from "@msc-ticketing/common";

import {User} from "../models/user";
import {PasswordManager} from "../services/PasswordManager";

const router = express.Router()

router.post('/api/auth/signin', [
        body('email')
            .isEmail()
            .withMessage('Email must be Valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    ValidateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email})
        if (!existingUser) {
            throw new BadRequestError('Invalid Credentials')
        }
        const passwordsMatch = await PasswordManager.compare(existingUser.password, password)
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid Password')
        }

        //Generate JWT Token
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!)

        //store jwt on session object
        req.session = {
            jwt: userJwt
        }
        res.status(200).send(existingUser)
    })

export {router as signinRouter};
