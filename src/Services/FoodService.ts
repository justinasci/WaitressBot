import { SlackApi } from "../Models/SlackApi";

class FoodService {
    slackApi: SlackApi = null;
    constructor(slackApi: SlackApi) {
        this.slackApi = slackApi;
    }

    dialog(payload) {
        console.log(payload);
        this.slackApi.web.dialog.open({
            trigger_id: payload.trigger_id,
            dialog: {
                title: 'Gaidys ne title',
                callback_id: 'clipit',
                elements: [{
                    label: 'Test',
                    type: 'text',
                    name: 'what',
                    value: 'Test Value'
                }]
            }
        }).then(result => console.log(result));

        return null;
    }
}

export { FoodService }