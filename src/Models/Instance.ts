import { Menu, Restaurant, Category } from "./Restaurants";
import { RandomUtils } from "../RandomUtils";
import { User } from "./User";
import { UserOrder } from "./UserOrder";

enum Stage { PICK_RESTAURANT, ORDERING, ROLLING, DONE }

class Instance {
    restaurant: Restaurant;
    token: string;
    stage: Stage;
    timestampId: string;
    owner: User;
    ownerControllsId: string;
    orders: Array<UserOrder>;

    constructor() {
        this.stage = Stage.PICK_RESTAURANT;
        this.orders = new Array<UserOrder>();
        this.token = RandomUtils.makeId();
    }

    addOrder(user: User,order: any) {
        const uorder = new UserOrder();
        uorder.user = user;
        uorder.id = this.orders.length;
        uorder.order = '';
        let price = 0;
        this.restaurant.menu.categories.forEach(category => {
            const selectedItem = order[category.name];
            const item = category.find(selectedItem);
            price += item.price;
            uorder.order += `${item.name} `;
        });

        const comment = order['comment'];
        if(comment) {
            uorder.comment = comment;
        }

        this.orders.push(uorder);
    }

    removeOrder() {

    }
}

export { Instance, Stage }