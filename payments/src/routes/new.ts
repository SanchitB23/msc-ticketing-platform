import express, {Request, Response} from "express";
import {BadRequestError, NotAuthorizedError, NotFoundError, RequireAuth, ValidateRequest} from "@msc-ticketing/common";
import {body} from "express-validator";
import {Order, OrderStatus} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";
import {PaymentCreatedPublisher} from "../events/publishers/payment-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()

router.post('/api/payments', RequireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
], ValidateRequest, async (req: Request, res: Response) => {
    console.log("PAYMENTS : New Payment API called")
    const {token, orderId} = req.body;
    const order = await Order.findById(orderId)
    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    if (order.status === OrderStatus.Cancelled) throw new BadRequestError('Order Expired / Cancelled')

    const stripeRes = await stripe.charges.create({
        currency: 'inr',
        amount: order.price * 100,
        source: token,
    })
    const payment = Payment.build({
        orderId,
        stripeId: stripeRes.id
    })
    await payment.save()
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })
    res.status(202).send({id: payment.stripeId})
})

export {router as createChargeRouter}
