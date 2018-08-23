import { ResponseBuilder } from "./ReponseBuilder";
import { MessageAttachment } from "@slack/client";
import { Instance } from "../Models/Instance";

class OwnerControllsResponseBuilder extends ResponseBuilder {

    user: string;

    set(instance: Instance) {
        this.setVisibleToAll();
        this.user = instance.owner.id;
        const attachment : MessageAttachment = {
            text: (instance.restaurant)? instance.restaurant.name : '',
            callback_id: instance.token,
            color: '#3AA3E3',
            actions: [],
        };
        attachment.actions.push(this.baseButtonAction('Roll', 'add'));
        attachment.actions.push(this.baseButtonAction('Close', 'add'));

        this.attachments.push(attachment);
        return this;
    }

    build() {
        const t = super.build();
        t.user = this. user;
        return t;
    }
}

export { OwnerControllsResponseBuilder }