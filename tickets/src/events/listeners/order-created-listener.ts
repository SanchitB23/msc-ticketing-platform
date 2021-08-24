import {Listener, OrderCreatedEvent, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket)
            throw new Error('Ticket not Found')
        ticket.set({orderId: data.id})
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        })
        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
}
