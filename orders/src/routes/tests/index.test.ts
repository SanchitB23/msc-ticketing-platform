import {Ticket} from "../../models/ticket";
import request from "supertest";
import {app} from "../../App";

const buildTicket = async () => {
    const ticket = Ticket.build({
        price: 20, title: "concert"
    })
    await ticket.save()
    return ticket
}

it('should fetch orders for a particular user', async function () {
    const t1 = await buildTicket()
    const t2 = await buildTicket()
    const t3 = await buildTicket()
    const u1 = global.signin()
    const u2 = global.signin()

    await request(app)
        .post('/api/orders')
        .set('Cookie', u1)
        .send({ticketId: t1.id})
        .expect(201)

    const {body: order1} = await request(app)
        .post('/api/orders')
        .set('Cookie', u2)
        .send({ticketId: t2.id})
        .expect(201)
    const {body: order2} = await request(app)
        .post('/api/orders')
        .set('Cookie', u2)
        .send({ticketId: t3.id})
        .expect(201)


    const res = await request(app)
        .get('/api/orders')
        .set('Cookie', u2)
        .expect(200)
    console.log(res.body)

    expect(res.body.length).toEqual(2)
    expect(res.body[0].id).toEqual(order1.id)
    expect(res.body[1].id).toEqual(order2.id)
    expect(res.body[0].ticket.id).toEqual(t2.id)
});

