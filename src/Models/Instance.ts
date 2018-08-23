import { Menu, Restaurant } from "./Restaurants";
import { RandomUtils } from "../RandomUtils";
import { User } from "./User";

enum Stage { PICK_RESTAURANT, ORDERING, ROLLING, DONE }

class Instance {
    restaurant: Restaurant;
    token: string;
    stage: Stage;
    timestampId: string;
    owner: User;
    ownerControllsId: string;

    constructor() {
        this.stage = Stage.PICK_RESTAURANT;
        this.token = RandomUtils.makeId();
    }
}

export { Instance, Stage }