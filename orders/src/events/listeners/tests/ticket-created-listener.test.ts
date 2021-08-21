import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketCreatedEvent} from "@msc-ticketing/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    title: "concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}

it('should create and save a ticket', async function () {
  const {msg, listener, data} = await setup();
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
});

it('should ack the message', async function () {
  const {msg, listener, data} = await setup();
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
});
