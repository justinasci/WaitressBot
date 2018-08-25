import { Menu, Restaurant, Category } from "./Restaurants";
import { RandomUtils } from "../RandomUtils";
import { User } from "./User";
import { UserOrder } from "./UserOrder";

enum Stage { PICK_RESTAURANT, ORDERING }

class Instance {
    restaurant: Restaurant;
    token: string;
    stage: Stage;
    timestampId: string;
    owner: User;
    ownerControllsId: string;
    orders: Array<UserOrder>;
    locked: boolean = false;
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

        const custom = order['custom_add'];
        if (custom) {
            const cat = this.restaurant.menu.find('custom');
            const item = cat.find(custom);
            if(!item) {
                cat.items.push({
                    name: custom,
                    price: 0
                })
                delete order['custom_add'];
                order['custom'] = custom;
            }
        }

        this.restaurant.menu.categories.forEach(category => {
            const selectedItem = order[category.name];
            let item = category.find(selectedItem);
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

    toggleOrderStatus(user: User, orderId: string) {
        const id = Number.parseInt(orderId);
        if(id === null) return;
        if(user.id !== this.owner.id) return;
        const order = this.orders.filter(ou => ou.id === id);
        if(order.length > 0) {
            order[0].paid = !order[0].paid;
        }
    }
}

export { Instance, Stage }