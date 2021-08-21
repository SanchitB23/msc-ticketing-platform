import {Listener, Subjects, TicketUpdatedEvent} from "@msc-ticketing/common";
import {qGroupName} from "../../constants/q-group-name";
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

    queueGroupName: string = qGroupName;
    subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
}
