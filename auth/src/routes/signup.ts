import express, {Request, Response} from "express";
import {body} from "express-validator";
import jwt from "jsonwebtoken";
import {BadRequestError, ValidateRequest,} from "@msc-ticketing/common";

import {User} from "../models/user";

const router = express.Router()

router.post('/api/auth/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be provided'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password Must be between 4 and 20 characters')
    ],
    ValidateRequest,
    async (req: Request, res: Response) => {
        console.log("AUTH : Signup API Called")
        const {email, password} = req.body;
        const existingUser = await User.findOne({email})

        if (existingUser) {
            console.log("Email Exists")
            throw new BadRequestError('Email in use')
        }

        //Send Data to MongoDB and save
        const user = User.build({email, password})
        await user.save()

        //Generate JWT Token
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)

        //store jwt on session object
        req.session = {
            jwt: userJwt
        }

        return res.status(201).send(user)
    })

export {router as signupRouter};
