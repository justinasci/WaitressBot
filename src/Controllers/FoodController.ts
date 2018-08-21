import { FoodService } from "../Services/FoodService";
import { RestaurantService } from "../Models/Restaurants";
import { RestaurantResponseBuilder } from "../Responses/RestaurantResponseBuilder";
import { InstanceManager } from "../Services/InstanceManager";
import { Instance, Stage } from "../Models/Instance";
import { OrderingResponseBuilder } from "../Responses/OrderingResponseBuilder";

class FoodController {
    foodService :FoodService;
    restaurantService: RestaurantService;
    instanceManager: InstanceManager; 

    constructor(foodService: FoodService, restaurantService: RestaurantService, instanceManager: InstanceManager) {
        this.foodService = foodService;
        this.restaurantService = restaurantService;
        this.instanceManager = instanceManager;
    } 

    startOrderInstance(request): String {
        const restaurants = this.restaurantService.getAll();
        const builder = new RestaurantResponseBuilder();
        const instance = new Instance();
        this.instanceManager.add(instance);
        builder.restaurant(restaurants, instance.token);
        return builder.build();
    }

    processEvent(request) {
        if(request.type === 'interactive_message') {
            const instance = this.instanceManager.handleEvent(request);
            if(instance.stage === Stage.ORDERING) {
                const builder = new OrderingResponseBuilder();
                const t = builder.order(instance);
            }
        }
        return request;
    }

}

export { FoodController };