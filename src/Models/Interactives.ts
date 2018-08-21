class Action {
    name: String;
    text: String;
    type: String;
    value: String;
}

class Attachment {
    constructor() {
        this.actions = new Array<Action>();
    }

    text: String;
    fallback: String;
    callback_id: String;
    color: String;
    attachment_type: String;
    actions: Array<Action>

}

export { Attachment, Action }