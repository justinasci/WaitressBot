import { ResponseBuilder } from "./ReponseBuilder";
import { Instance } from "../Models/Instance";
import { Attachment } from "../Models/Interactives";

class OrderingResponseBuilder extends ResponseBuilder {
    order(instance: Instance) {
        this.setVisibleToAll();
        const attachment = new Attachment();
        attachment.text = instance.restaurant.name;
        attachment.callback_id = instance.token;
        attachment.color = '#3AA3E3';
        attachment.attachment_type = 'default';
        attachment.actions.push(this.baseButtonAction('+', 'add'));
        this.attachments.push(attachment);
        return this;
    }
}

export { OrderingResponseBuilder }