import express, {Request, Response} from "express";
import {RequireAuth} from "@msc-ticketing/common";
import {Order} from "../models/order";

const router = express.Router()

router.get('/api/orders', RequireAuth, async (req: Request, res: Response) => {
        console.log("ORDERS : Fetch All API Called")

    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate('ticket')
    res.send(orders)
})

export {router as indexOrderRouter};
