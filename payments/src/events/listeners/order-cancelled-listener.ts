import {Listener, OrderCancelledEvent, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Order, OrderStatus} from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        })
        if (!order) throw new Error('Order not Found')
        order.set({status: OrderStatus.Cancelled})
        await order.save()
        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
}
