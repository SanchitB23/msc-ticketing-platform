import {Listener, Subjects, TicketUpdatedEvent} from "@msc-ticketing/common";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findByEvent(data)
        if (!ticket)
            throw new Error('Ticket not found')
        const {title, price} = data;
        ticket.set({title, price})
        await ticket.save()
        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
}
