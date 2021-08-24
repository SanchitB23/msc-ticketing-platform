import express, {Request, Response} from "express";
import {RequireAuth, ValidateRequest} from "@msc-ticketing/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {TicketCreatedPublisher} from "../events/publishers/ticket-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()

router.post('/api/tickets',
    RequireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({gt: 0})
            .withMessage('Price must be greater than 0'),
    ],
    ValidateRequest,
    async (req: Request, res: Response) => {
            console.log("TICKETS : New API Called")

        const {title, price} = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        });
        await ticket.save();
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id, price: ticket.price, title: ticket.title, userId: ticket.userId, version: ticket.version
        })
        res.status(201).send(ticket);
    }
)

export {router as createTicketRouter}
