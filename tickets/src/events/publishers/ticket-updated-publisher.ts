import {Publisher, Subjects, TicketUpdatedEvent} from "@msc-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
