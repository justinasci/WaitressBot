import { ResponseBuilder } from "./ReponseBuilder";
import { Instance } from "../Models/Instance";
import { MessageAttachment, OptionField } from "@slack/client";
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

    formatUsers(uo: UserOrder) {
        const linebreak = '\n';
        return `${uo.id}. <@${uo.user.name}> ${(!uo.paid)? ':exclamation:': ''} ${(uo.comment)? '(' + uo.comment +')': ''} ${linebreak}`;
    }

    set(instance: Instance) {
        this.setVisibleToAll();
        const attachment : MessageAttachment = {
            text: '',
            callback_id: instance.token,
            color: '#3AA3E3',
            actions: [],
            fields: [],
            author_icon: (instance.restaurant.imageUrl)? instance.restaurant.imageUrl: '',
            author_name: (instance.restaurant)? instance.restaurant.name : '',
            author_link: (instance.restaurant.url)? instance.restaurant.url : '',
        
        };

        const uniqueOrders: UniqueOrder[] = this.mapUniqueOrders(instance.orders);
        const options: OptionField[] = [];

        uniqueOrders.forEach(order => {
            const users: string = order.userOrders
                .map(this.formatUsers)
                .reduce((p, c) => `${p} ${c}`);

            attachment.fields.push({
                short: false,
                title: `${order.order}: ${order.userOrders.length}`,
                value: users
            });
        });

        instance.orders.forEach(order => {
            options.push({
                text: `${order.id}. <@${order.user.name}> ${(!order.paid)? ':exclamation:': ''} `,
                value: order.id.toString(),
            });
        });

        attachment.actions.push(this.baseButtonAction('Order', 'add'));
        attachment.actions.push(this.cancelButtonAction('Cancel my Order', 'cancel'));
        attachment.actions.push(this.baseSelect('pay','Toggle Order Status', options));


        this.attachments.push(attachment);
        return this;
    }
}

export { OrderingResponseBuilder }