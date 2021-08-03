import request from "supertest";
import {Ticket} from "../../models/ticket";
import {app} from "../../App";
import {Order, OrderStatus} from "../../models/order";

it('should delete the order', async function () {
    const ticket = Ticket.build({
        price: 20, title: "concert"
    })
    await ticket.save()
    const user = global.signin()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
});
