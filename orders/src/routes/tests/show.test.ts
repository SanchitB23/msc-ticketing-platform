import {Ticket} from "../../models/ticket";
import request from "supertest";
import {app} from "../../App";
import mongoose from "mongoose";

it('should fetch the order', async function () {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20, title: "concert"
    })
    await ticket.save()
    const user = global.signin()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
    expect(fetchedOrder.id).toEqual(order.id)
});

it('should fetch the order from someone else\'s ID', async function () {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20, title: "concert"
    })
    await ticket.save()
    const user = global.signin()
    const {body: order} =await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401)
});
