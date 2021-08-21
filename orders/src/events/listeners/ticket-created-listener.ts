import {Message} from "node-nats-streaming";
import {Listener, Subjects, TicketCreatedEvent} from "@msc-ticketing/common";
import {qGroupName} from "../../constants/q-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const {id, title, price} = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        })
        await ticket.save()
        msg.ack()
    }

    queueGroupName: string = qGroupName;
    subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
}
