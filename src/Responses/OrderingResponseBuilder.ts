import { ResponseBuilder } from "./ReponseBuilder";
import { Instance } from "../Models/Instance";
import { MessageAttachment } from "@slack/client";

class OrderingResponseBuilder extends ResponseBuilder {
    order(instance: Instance) {
        this.setVisibleToAll();
        const attachment : MessageAttachment = {
            text: instance.restaurant.name,
            callback_id: instance.token,
            color: '#3AA3E3',
            actions: [],
            fields: [{
                title: 'Restoranas',
                value: 'Labas Rytas'
            }]
        };
        attachment.actions.push(this.baseButtonAction('Order', 'add'));
        this.attachments.push(attachment);
        return this;
    }
}

export { OrderingResponseBuilder }