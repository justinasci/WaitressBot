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
import { OrderDialogBuilder } from "../Dialogs/OrderDialogBuilder";

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

    startOrderInstance(request): any {
        console.log(request);
        const restaurants = this.restaurantService.getAll();
        const instance = new Instance();
        instance.owner = {id: request.user_id, name: request.user_name};
        this.instanceManager.add(instance);
        return new RestaurantResponseBuilder().set(restaurants, instance.token).build();
    }

    processEvent(event): any {
        console.log(event);
        if(event.type === 'interactive_message') {
            const instance = this.instanceManager.get(event.callback_id);
            if (instance) {
                if(instance.stage === Stage.PICK_RESTAURANT) {
                    this.instanceManager._handlePickStageEvent(instance, event);
                    const builder = new OrderingResponseBuilder();
                    const orderMessage = builder.set(instance).setChannel(event.channel.id).build();
                    const ownerMessage = new OwnerControllsResponseBuilder().set(instance).setChannel(event.channel.id).build();

                    this.slackApi.web.chat.postMessage(orderMessage).then((r) => {
                        //@ts-ignore, Ignoring 'non existant' timestap id.
                        instance.timestampId = r.ts;
                        //@ts-ignore, Ignoring 'non existant' timestap id.
                        this.slackApi.web.chat.postEphemeral(ownerMessage).then((r) => {instance.ownerControllsId = r.ts});
                    });
                    console.log(ownerMessage);
                    console.log(instance);
                    return ResponseBuilder.deleteMessage();
                }

                if (instance.stage === Stage.ORDERING) {
                    const builder = new OrderDialogBuilder().set(instance, event.trigger_id);
                    console.log(builder.build());
                    this.slackApi.web.dialog.open(builder.build()).then(r => { console.log(r)}).catch(err => console.log(err));
                }
            }
        }

        return null;
    }
}

export { FoodController };