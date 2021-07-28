import express from "express";
import 'express-async-errors'
import {CurrentUser, errorHandler, NotFoundError} from "@msc-ticketing/common";
import cookieSession from "cookie-session";
import {createTicketRouter} from "./routes/new";
import {showTicketRouter} from "./routes/show";
import {indexTicketRouter} from "./routes";
import {updateTicketRouter} from "./routes/update";


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
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}
