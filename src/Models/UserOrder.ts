import { User } from "./User";
import { Category } from "./Restaurants";

class UserOrder {
    user: User;
    order: string;
    comment: string;
    id: number;
    paid: boolean = false;
}


export { UserOrder }; 