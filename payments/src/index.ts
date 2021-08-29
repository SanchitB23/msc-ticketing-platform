import mongoose from "mongoose";
import {app} from "./App";
import {DatabaseConnectionError} from "@msc-ticketing/common";
import {natsWrapper} from "./nats-wrapper";
import {OrderCreatedListener} from "./events/listeners/order-created-listener";
import {OrderCancelledListener} from "./events/listeners/order-cancelled-listener";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT not found')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO URI not defined')
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID not defined')
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID not defined')
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL not defined')
    }
    //NATS Connect and Config
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
        console.log("NATS Connection Closed")
        process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()
    try {
        //Mongoose Connect
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connected to Payments MongoDB")
    } catch (e) {
        console.error(e)
        throw new DatabaseConnectionError()
    }
    app.listen(3000, () => {
        console.log("Payments Listening on Port 3000!")
    })
}

start()
    .then(() => console.log("Payments Server Started"))
