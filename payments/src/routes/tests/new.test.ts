import request from "supertest";
import {app} from "../../App";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@msc-ticketing/common";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payment";

it('should return 404 when purchasing an order does not exist', async function () {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdffasd0',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
});

it('should return 401 purchasing an order that doesnt belong to user', async function () {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdffasd0',
            orderId: order.id
        })
        .expect(401)
});

it('should return 400 on purchasing a cancelled order', async function () {
    const userId = mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdffasd0',
            orderId: order.id
        })
        .expect(400)
});

it('should return a 204 with valid inputs', async function () {
    const userId = mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(202)
    const chargeOptions = await stripe.charges.list({limit: 50})
    const stripeCharge = chargeOptions.data.find((charge) => charge.amount === price * 100)
    expect(stripeCharge).toBeDefined()
    expect(stripeCharge!.currency).toEqual('inr')

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    })
    expect(payment).not.toBeNull()
});
