import {Listener, OrderCancelledEvent, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new Error('Ticket not Found')
        ticket.set({orderId: undefined})
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
        })
        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
}
