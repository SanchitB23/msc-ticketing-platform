import request from "supertest";

import {app} from "../../App";
import mongoose from "mongoose";

it('should return 404 if ticket is not found', async function () {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
});

it('should return ticket if ticket is found', async function () {
    const title = 'concert'
    const price = 20

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title, price
        })
        .expect(201)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()
        .expect(200)
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
});
