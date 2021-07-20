import mongoose from "mongoose";
import {app} from "./App";
import {DatabaseConnectionError} from "./errors/database-connection-error";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT not found')
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connected to Auth MongoDB")
    } catch (e) {
        console.error(e)
        throw new DatabaseConnectionError()
    }
    app.listen(3000, () => {
        console.log("Auth Listening on Port 3000!")
    })
}

start()
    .then(() => console.log("Auth Server Started"))
