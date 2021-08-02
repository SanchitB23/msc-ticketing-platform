import express from "express";
import 'express-async-errors'
import {CurrentUser, errorHandler, NotFoundError} from "@msc-ticketing/common";
import cookieSession from "cookie-session";
import {indexOrderRouter} from "./routes";
import {newOrderRouter} from "./routes/new";
import {deleteOrderRouter} from "./routes/delete";
import {showOrderRouter} from "./routes/show";


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
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(deleteOrderRouter)
app.use(showOrderRouter)

app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}
