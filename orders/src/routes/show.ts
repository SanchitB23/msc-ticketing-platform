import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, RequireAuth} from "@msc-ticketing/common";
import {Order} from "../models/order";

const router = express.Router()

router.get('/api/orders/:orderId', RequireAuth, async (req: Request, res: Response) => {
    console.log("ORDERS : Show One API Called")

    const order = await Order
        .findById(req.params.orderId)
        .populate('ticket')
    if (!order)
        throw new NotFoundError()
    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError()
    res.send(order)
})

export {router as showOrderRouter};
