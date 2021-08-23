import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@msc-ticketing/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = Ticket.build({
    price: 100,
    title: "concert",
    userId: "asf",
  })
  await ticket.save()
  const data: OrderCreatedEvent['data'] = {
    expiresAt: "sadsad",
    status: OrderStatus.Created,
    ticket: {id: ticket.id, price: ticket.price},
    userId: "sdfdsf",
    version: 0,
    id: mongoose.Types.ObjectId().toHexString()
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {msg, listener, data, ticket}
}

it('should set the userId of the ticket', async function () {
  const {msg, listener, data, ticket} = await setup();
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
});

it('should ack the message', async function () {
  const {msg, listener, data} = await setup();
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
});

it('should publish a ticket updated event', async function () {
  const {msg, listener, data} = await setup();
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});
