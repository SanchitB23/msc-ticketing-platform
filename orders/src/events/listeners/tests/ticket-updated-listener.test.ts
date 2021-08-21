import {TicketUpdatedListener} from "../ticket-updated-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketUpdatedEvent} from "@msc-ticketing/common";
import mongoose from "mongoose";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 100,
        title: "concert",
    })
    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        price: 110,
        title: "updated concert",
        userId: "1234",
        version: ticket.version + 1
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, data, ticket, msg}
}

it('should find,update,save a ticket', async function () {
    const {listener, data, msg, ticket} = await setup();
    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)

});

it('should ack the message', async function () {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
});

it('should not call ack if the event has skipped version number', async function () {
    const {listener, data, msg} = await setup();
    data.version = 10
    try {
        await listener.onMessage(data, msg)
    } catch (e) {
    }
    expect(msg.ack).not.toHaveBeenCalled()
});
