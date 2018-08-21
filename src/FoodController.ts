import { FoodService } from "./FoodService";

class FoodController {
    foodService :FoodService;
    constructor(foodService: FoodService) {
        this.foodService = foodService;
    } 

    parse (data) {
        return this.foodService.dialog(data);
    }

}

export { FoodController };