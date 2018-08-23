import { AttachmentAction, MessageAttachment } from "@slack/client";

enum ResponseType { Ephemeral = 'ephemeral', InChannel = 'in_channel' }

class ResponseBuilder {

    text: string;
    channel?: string; 
    attachments: Array<MessageAttachment>;
    response_type: ResponseType;

    constructor() {
        this.text = '';
        this.attachments = new Array<MessageAttachment>();
        this.response_type = ResponseType.Ephemeral;
    }

    static deleteMessage() {
        return {
            "response_type": "ephemeral",
            "replace_original": true,
            "delete_original": true,
            "text": ""
        }
    }

    setText(text:string): ResponseBuilder {
        this.text = text;
        return this;
    };

    setChannel(channel :string): ResponseBuilder {
        this.channel = channel;
        return this;
    }

    attachment(attachment: MessageAttachment): ResponseBuilder {
        this.attachments.push(attachment);
        return this;
    }

    baseButtonAction(name:string, value:string) : AttachmentAction {
        const action: AttachmentAction = {
            type: 'button',
            text: name,
            value: value,
            name: name
        }
        return action;
    }

    setVisibleToAll() {
        this.response_type = ResponseType.InChannel;    
    }

    build():any {
        return {
            text: this.text,
            attachments: this.attachments,
            channel: this.channel
        }
    }
}

export { ResponseBuilder }