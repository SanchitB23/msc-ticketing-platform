import express from "express";
import 'express-async-errors'
import {errorHandler, NotFoundError} from "@msc-ticketing/common";
import cookieSession from "cookie-session";



const app = express()
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))
/*
* Routes
*/


app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}
