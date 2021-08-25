import {ExpirationCompleteEvent, Listener, OrderStatus, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Order} from "../../models/order";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId)
        if (!order)
            throw new Error('Order Not Found')
        //todo manage payments complete thing
        order.set({
            status: OrderStatus.Cancelled
        })
        await order.save()
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id, ticket: {id: order.ticket._id}, version: order.version
        })
        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: ExpirationCompleteEvent["subject"] = Subjects.ExpirationComplete;
}
