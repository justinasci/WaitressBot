import { Attachment } from "../Models/Interactives";
import { Restaurant } from "../Models/Restaurants";
import { ResponseBuilder } from "./ReponseBuilder";

class RestaurantResponseBuilder extends ResponseBuilder {

    restaurant(restaurants: Restaurant[], callbackID: String): RestaurantResponseBuilder {
        const attachment = new Attachment();
        attachment.text = 'Kur valgyt?';
        attachment.callback_id = callbackID;
        attachment.color = '#3AA3E3';
        attachment.attachment_type = 'default';
        restaurants.forEach(restaurant => {
            attachment.actions.push(this.baseButtonAction(restaurant.name, restaurant.name.toLowerCase()));
        });
        this.attachments.push(attachment);
        return this;
    }
}

export { RestaurantResponseBuilder };