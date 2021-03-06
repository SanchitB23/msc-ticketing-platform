import mongoose from "mongoose";
import {app} from "./App";
import {DatabaseConnectionError} from "@msc-ticketing/common";

const start = async () => {
    console.log("Starting Auth Service")
    if (!process.env.JWT_KEY) {
        throw new Error('JWT not found')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO URI not defined')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
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
