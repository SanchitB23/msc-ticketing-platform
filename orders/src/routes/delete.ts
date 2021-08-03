import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, RequireAuth} from "@msc-ticketing/common";
import {Order, OrderStatus} from "../models/order";

const router = express.Router()

router.delete('/api/orders/:orderId', RequireAuth, async (req: Request, res: Response) => {
    const {orderId} = req.params;
    const order = await Order.findById(orderId)

    if (!order)
        throw new NotFoundError()
    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled
    await order.save()

    res.status(204).send(order)
})

export {router as deleteOrderRouter};
