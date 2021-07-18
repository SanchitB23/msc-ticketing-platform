import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {RequestValidationError} from "../errors/request-validation-error";

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
    (req: Request, res: Response) => {
        console.log("Trying to Sign up")
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }
        console.log("Creating User")
        const {email, password} = req.body;
        res.status(201).send({
            message: "User Created",
            data: {
                email, password
            }
        })
    })

export {router as signupRouter};
