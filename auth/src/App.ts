import express from "express";
import 'express-async-errors'

import {currentUserRouter} from "./routes/current-user";
import {signinRouter} from "./routes/signin";
import {signupRouter} from "./routes/signup";
import {signoutRouter} from "./routes/signout";
import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";

const app = express()

app.use(express.json())

/*
* Routes
*/

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)
app.listen(3000, () => {
    console.log("Auth Listening on Port 3000!")
})
