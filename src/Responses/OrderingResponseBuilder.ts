import { ResponseBuilder } from "./ReponseBuilder";
import { Instance } from "../Models/Instance";
import { MessageAttachment } from "@slack/client";
import { UserOrder } from "../Models/UserOrder";
import { User } from "../Models/User";

interface UniqueOrder {
    order: string;
    userOrders: UserOrder[];
}


class OrderingResponseBuilder extends ResponseBuilder {

    mapUniqueOrders(orders: UserOrder[]) : Array<UniqueOrder> {
        const map = new Map<string, UniqueOrder>();
        orders.forEach(order => {
            if (map.has(order.order)) {
                map.get(order.order).userOrders.push(order);
            } else {
                map.set(order.order, {
                    order: order.order,
                    userOrders: [order]
                });
            }
        });
        return Array.from(map.values());
    }

    set(instance: Instance) {
        this.setVisibleToAll();
        const attachment : MessageAttachment = {
            text: (instance.restaurant)? instance.restaurant.name : '',
            callback_id: instance.token,
            color: '#3AA3E3',
            actions: [],
            fields: [],
        };

        const uniqueOrders: UniqueOrder[] = this.mapUniqueOrders(instance.orders);
        const linebreak = '\n';
        const formatUsers = (uo: UserOrder) => `${uo.id}. <@${uo.user.name}> ${(!uo.paid)? ':exclamation:': ''} ${(uo.comment)? '(' + uo.comment +')': ''} ${linebreak}`;

        uniqueOrders.forEach(order => {
            const users: string = order.userOrders
                .map(formatUsers)
                .reduce((p, c) => `${p} ${c}`);

            attachment.fields.push({
                short: false,
                title: `${order.order}: ${order.userOrders.length}`,
                value: users
            });
        });

        attachment.actions.push(this.baseButtonAction('Order', 'add'));
        attachment.actions.push(this.cancelButtonAction('Cancel my Order', 'add'));
        this.attachments.push(attachment);
        return this;
    }
}

export { OrderingResponseBuilder }