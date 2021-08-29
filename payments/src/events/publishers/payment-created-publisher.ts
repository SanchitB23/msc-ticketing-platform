import {PaymentCreatedEvent, Publisher, Subjects} from "@msc-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: PaymentCreatedEvent["subject"] = Subjects.PaymentCreated;

}
