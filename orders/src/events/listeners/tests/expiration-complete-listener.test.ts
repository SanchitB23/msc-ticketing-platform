import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import {Order} from "../../../models/order";
import {ExpirationCompleteEvent, OrderStatus} from "@msc-ticketing/common";
import {Message} from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(), price: 20, title: "concert"
    })
    await ticket.save()
    const order = Order.build({
        expiresAt: new Date(), status: OrderStatus.Created, ticket, userId: "123"
    })
    await order.save()
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {msg, listener, order, data, ticket}
}

it('should update the order status to cancelled', async function () {
    const {listener, msg, order, data} = await setup();
    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
});

it('should emit an OrderCancelled event', async function () {
    const {listener, msg, data} = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    // const eventData = JSON.parse(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    // expect(eventData.id).toEqual(order.id)
});
it('should ack the message', async function () {
    const {listener, msg, data} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
});
