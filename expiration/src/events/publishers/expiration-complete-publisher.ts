import {ExpirationCompleteEvent, Publisher, Subjects} from "@msc-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: ExpirationCompleteEvent["subject"] = Subjects.ExpirationComplete;
}
