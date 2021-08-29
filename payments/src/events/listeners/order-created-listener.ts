import {Listener, OrderCreatedEvent, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Order} from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id:data.id,
            price:data.ticket.price,
            status:data.status,
            userId:data.userId,
            version:data.version,
        })
        await order.save()
        msg.ack()
    }

    queueGroupName: string=QUEUE_GROUP_NAME;
    subject: OrderCreatedEvent["subject"]=Subjects.OrderCreated;

}
