import {Listener, OrderCreatedEvent, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        await expirationQueue.add({
                orderId: data.id
            },
            {delay}
        )

        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
}
