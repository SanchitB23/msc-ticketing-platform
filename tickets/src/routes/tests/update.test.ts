import request from "supertest";
import {app} from "../../App";
import mongoose from "mongoose";

it('should return 404 if id does not exist', async function () {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: "title",
            price: 20
        })
        .expect(404)
});
it('should return 401 if user is not authenticated', async function () {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "title",
            price: 20
        })
        .expect(401)
});
it('should return  a 401 if user does not own the ticket', async function () {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: "Test",
            price: 20
        })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: "test",
            price: 100
        })
        .expect(401)
});
it('should return 400 if user provides invalid title or price', async function () {
    const cookie = global.signin()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: "Test",
            price: 20
        })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "",
            price: 10
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "test2",
            price: -40
        })
        .expect(400)

});
it('should update the ticket provided valid inputs', async function () {
    const cookie = global.signin()
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: "Test",
            price: 20
        })
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "test2",
            price: 10
        })
        .expect(200)

    const ticketRes = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send()

    expect(ticketRes.body.title).toEqual('test2')
    expect(ticketRes.body.price).toEqual(10)
}); 
