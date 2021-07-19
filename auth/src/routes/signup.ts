import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import jwt from "jsonwebtoken";

import {RequestValidationError} from "../errors/request-validation-error";
import {User} from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";

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
    async (req: Request, res: Response) => {
        console.log("Trying to Sign up")
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log("Validation Error")
            throw new RequestValidationError(errors.array())
        }

        console.log("Creating User")
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

        return res.status(201).send({user})
    })

export {router as signupRouter};
