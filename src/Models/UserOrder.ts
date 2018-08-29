import { User } from "./User";

class UserOrder {
    user: User;
    order: string;
    comment: string;
    id: number;
    paid: boolean = false;
}


export { UserOrder }; 