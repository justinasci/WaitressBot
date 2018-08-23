import { FoodService } from "../Services/FoodService";
import { RestaurantService } from "../Models/Restaurants";
import { RestaurantResponseBuilder } from "../Responses/RestaurantResponseBuilder";
import { InstanceManager } from "../Services/InstanceManager";
import { Instance, Stage } from "../Models/Instance";
import { OrderingResponseBuilder } from "../Responses/OrderingResponseBuilder";
import { SlackApi } from "../Models/SlackApi";
import { ResponseBuilder } from "../Responses/ReponseBuilder";
import { User } from "../Models/User";
import { OwnerControllsResponseBuilder }from'../Responses/OwnerControllsResponseBuilder'

class FoodController {
    foodService :FoodService;
    restaurantService: RestaurantService;
    instanceManager: InstanceManager; 
    slackApi: SlackApi;

    constructor(foodService: FoodService, restaurantService: RestaurantService, instanceManager: InstanceManager, slackApi: SlackApi) {
        this.foodService = foodService;
        this.restaurantService = restaurantService;
        this.instanceManager = instanceManager;
        this.slackApi = slackApi;
    } 

    startOrderInstance(request): String {
        console.log(request);
        const restaurants = this.restaurantService.getAll();
        const builder = new RestaurantResponseBuilder();
        const instance = new Instance();
        instance.owner = {id: request.user_id, name: request.user_name};
        this.instanceManager.add(instance);
        builder.restaurant(restaurants, instance.token);
        return builder.build();
    }

    processEvent(event) {
        console.log(event);
        if(event.type === 'interactive_message') {
            const instance = this.instanceManager.get(event.callback_id);
            if (instance) {
                if(instance.stage === Stage.PICK_RESTAURANT) {
                    this.instanceManager._handlePickStageEvent(instance, event);
                    const builder = new OrderingResponseBuilder();
                    const orderMessage = builder.order(instance).setChannel(event.channel.id).build();
                    const ownerMessage = new OwnerControllsResponseBuilder().setControlls(instance).setChannel(event.channel.id).build();
                    //@ts-ignore, Ignoring 'non existant' timestap id.
                    this.slackApi.web.chat.postMessage(orderMessage).then((r) => {instance.timestampId = r.ts});
                    console.log(ownerMessage);
                    //@ts-ignore, Ignoring 'non existant' timestap id.
                    this.slackApi.web.chat.postEphemeral(ownerMessage).then((r) => {instance.ownerControllsId = r.ts});
                    console.log(instance);
                    return ResponseBuilder.deleteMessage();
                }

                if (instance.stage === Stage.ORDERING) {

                }
            }
        }

        return null;
    }
}

export { FoodController };