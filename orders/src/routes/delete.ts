import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, RequireAuth} from "@msc-ticketing/common";
import {Order, OrderStatus} from "../models/order";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()

router.delete('/api/orders/:orderId', RequireAuth, async (req: Request, res: Response) => {
    console.log("ORDERS : Delete API Called")
    const {orderId} = req.params;
    const order = await Order.findById(orderId)

    if (!order)
        throw new NotFoundError()
    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled
    await order.save()
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        version: order.version,
        id: order.id, ticket: {id: order.ticket.id}
    })
    res.status(204).send(order)
})

export {router as deleteOrderRouter};
