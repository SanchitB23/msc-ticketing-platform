import mongoose from "mongoose";
import {app} from "./App";
import {DatabaseConnectionError} from "@msc-ticketing/common";
import {natsWrapper} from "./nats-wrapper";
import {TicketCreatedListener} from "./events/listeners/ticket-created-listener";
import {TicketUpdatedListener} from "./events/listeners/ticket-updated-listener";
import {ExpirationCompleteListener} from "./events/listeners/expiration-complete-listener";
import {PaymentCreatedListener} from "./events/listeners/payment-created-listener";

const start = async () => {
    console.log("Starting Orders Service")
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
    // noinspection DuplicatedCode
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
        console.log("NATS Connection Closed")
        process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()
    try {
        //Mongoose Connect
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connected to Tickets MongoDB")
    } catch (e) {
        console.error(e)
        throw new DatabaseConnectionError()
    }
    app.listen(3000, () => {
        console.log("Orders Listening on Port 3000!")
    })
}

start()
    .then(() => console.log("Orders Server Started"))
