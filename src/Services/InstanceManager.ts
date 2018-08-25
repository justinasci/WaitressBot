import { Instance, Stage } from "../Models/Instance";
import { RestaurantService, Menu, Restaurant, Category } from "../Models/Restaurants";
import { SlackApi } from "../Models/SlackApi";
import { eventNames } from "cluster";

class InstanceManager {
    instances: Map<String, Instance>;
    restaurantService: RestaurantService;
    slackApi: SlackApi;

    constructor (restaurantService: RestaurantService, slackApi: SlackApi) {

        this.instances = new Map<String, Instance>();
        this.restaurantService = restaurantService;
        this.slackApi = slackApi;
    }

    add(instance: Instance) {
        this.instances.set(instance.token, instance);
    }

    get(token: String): Instance {
        return this.instances.get(token);
    }

    getRandomOrder (instance: Instance) {
        // Kazkada bus random.org
        const len = instance.orders.length;
        const randomNumber = Math.floor(Math.random() * len);
        return instance.orders[randomNumber];
    }

    handleEvent(event): Instance {
        const instance = this.instances.get(event.callback_id);
        if (instance.stage === Stage.PICK_RESTAURANT) {
            return this._handlePickStageEvent(instance, event);
        }
        else if (instance.stage === Stage.ORDERING) {
            return this._handleOrderingStageEvent(instance, event);
        }
        return new Instance();
    }

    _handlePickStageEvent(instance: Instance, event): Instance {
        const restaurantName = event.actions[0].value;
        const restaurant = this.restaurantService.get(restaurantName);
        if (restaurant) {
            instance.restaurant = restaurant;
        } else {
            instance.restaurant = new Restaurant();
            instance.restaurant.menu = new Menu();
            instance.restaurant.name = 'Custom Order';
            instance.restaurant.menu.dynamic = true;
            const cat = new Category();
            cat.name = 'custom';
            instance.restaurant.menu.categories.push(cat);
        }


        instance.stage = Stage.ORDERING;
        return instance;
    }

    _handleOrderingStageEvent(instance: Instance, event) {
        return instance;
    }


}

export { InstanceManager };