import { Menu, Restaurant } from "./Restaurants";
import { RandomUtils } from "../RandomUtils";

enum Stage { PICK_RESTAURANT, ORDERING, ROLLING, DONE }

class Instance {
    menu: Menu;
    restaurant: Restaurant;
    token: String;
    stage: Stage;

    constructor() {
        this.stage = Stage.PICK_RESTAURANT;
        this.token = RandomUtils.makeId();
    }
}

export { Instance, Stage }