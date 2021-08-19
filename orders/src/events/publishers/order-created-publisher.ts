import {OrderCreatedEvent, Publisher, Subjects} from "@msc-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
