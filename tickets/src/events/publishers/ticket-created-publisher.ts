import {Publisher, Subjects, TicketCreatedEvent} from "@msc-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
