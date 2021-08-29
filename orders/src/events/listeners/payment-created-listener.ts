import {Listener, PaymentCreatedEvent, Subjects} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";
import {QUEUE_GROUP_NAME} from "../../constants";
import {Order, OrderStatus} from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId)
        if (!order) throw new Error('Order Not Found')
        order.set({status: OrderStatus.Complete})
        await order.save()
        msg.ack()
    }

    queueGroupName: string = QUEUE_GROUP_NAME;
    subject: PaymentCreatedEvent["subject"] = Subjects.PaymentCreated;
}
