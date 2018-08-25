import { Restaurant } from "../Models/Restaurants";
import { ResponseBuilder } from "./ReponseBuilder";
import { MessageAttachment } from "@slack/client";

class RestaurantResponseBuilder extends ResponseBuilder {

    set(restaurants: Restaurant[], callbackID: string): RestaurantResponseBuilder {
        const attachment: MessageAttachment = {
            text: 'Kur valgyt?',
            callback_id: callbackID,
            color: '#3AA3E3',
            actions: [],
        }
        attachment.actions.push(this.baseButtonAction('Other (Reiks uzskymus ranka ivest)', 'other'));
        
        restaurants.forEach(restaurant => {
            attachment.actions.push(this.baseButtonAction(restaurant.name, restaurant.name));
        });

        this.attachments.push(attachment);
        return this;
    }
}

export { RestaurantResponseBuilder };