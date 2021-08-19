import express, {Request, Response} from "express";
import {BadRequestError, NotFoundError, OrderStatus, RequireAuth} from "@msc-ticketing/common";
import {body} from "express-validator";
import mongoose from "mongoose";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders',
    RequireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided')
    ],
    async (req: Request, res: Response) => {
        const {ticketId} = req.body;
        const ticket = await Ticket.findById(ticketId)
        if (!ticket)
            throw new NotFoundError()

        const isReserved = await ticket.isReserved()

        if (isReserved)
            throw new BadRequestError('Ticket already reserved')

        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

        const order = Order.build({
            expiresAt: expiration,
            status: OrderStatus.Created,
            ticket,
            userId: req.currentUser!.id
        })
        await order.save()
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            expiresAt: order.expiresAt.toISOString(),
            status: order.status,
            ticket: {
                id: ticket.id,
                price: ticket.price
            },
            userId: order.userId
        })
        res.status(201).send(order)
    })

export {router as newOrderRouter};
