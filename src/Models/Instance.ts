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
    private _idTracker: number = 0;

    constructor() {
        this.stage = Stage.PICK_RESTAURANT;
        this.orders = new Array<UserOrder>();
        this.token = RandomUtils.makeId();
    }

    addOrder(user: User,order: any) {
        const uorder = new UserOrder();
        uorder.user = user;
        uorder.id = this._idTracker++;
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

    removeOrder(user: User, cancelation: any): boolean {
        const id = Number.parseInt(cancelation.id);
        if(id === null) return false;
        const orders = this.orders.filter((uo) => uo.id === id);
        if(orders.length > 0) {
            if(orders[0].user.id == user.id) 
            {
                this.orders = this.orders.filter((uo) => uo.id !== id);
                return true;
            }
        }
        return false;
    }
}

export { Instance, Stage }