import { WebClient, RTMClient} from '@slack/client';

export class SlackApi {
    web: WebClient;
    rtm: RTMClient;
    constructor (token) {
        this.rtm = new RTMClient(token);
        this.web = new WebClient(token);
        this.rtm.start();
    };
}