import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCancelledEvent} from "@msc-ticketing/common";
import mongoose from "mongoose";
import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    price: 100,
    title: "concert",
    userId: "asf",
  })
  ticket.set({orderId})
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: 0
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {msg, listener, data, ticket, orderId}
}

it('should update ticket, publish event and ack the message', async function () {
  const {msg, listener, data, ticket} = await setup();
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});
