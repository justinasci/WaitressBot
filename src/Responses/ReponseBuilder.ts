import { Attachment, Action } from "../Models/Interactives";

enum ResponseType { Ephemeral = 'ephemeral', InChannel = 'in_channel' }

class ResponseBuilder {

    text: String;
    attachments: Array<Attachment>;
    response_type: ResponseType;

    constructor() {
        this.text = '';
        this.attachments = new Array<Attachment>();
        this.response_type = ResponseType.Ephemeral;
    }

    setText(text:String): ResponseBuilder {
        this.text = text;
        return this;
    };

    attachment(attachment: Attachment): ResponseBuilder {
        this.attachments.push(attachment);
        return this;
    }

    baseButtonAction(name:String, value:String) : Action {
        const action = new Action();
        action.type = 'button';
        action.name = name;
        action.value = value;
        action.text = name;
        return action;
    }

    setVisibleToAll() {
        this.response_type = ResponseType.InChannel;    
    }

    build(): any {
        const result = {};
        const temp = {
            text: this.text,
            attachments: this.attachments
        }
        return temp;
    }
}

export { ResponseBuilder }