import express from "express";
import 'express-async-errors'
import {errorHandler, NotFoundError,CurrentUser} from "@msc-ticketing/common";
import cookieSession from "cookie-session";
import {createTicketRouter} from "./routes/new";


const app = express()
app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))
app.use(CurrentUser)
/*
* Routes
*/
app.use(createTicketRouter)

app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}
