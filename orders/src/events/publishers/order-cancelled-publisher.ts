import {OrderCancelledEvent, Publisher, Subjects} from "@msc-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
