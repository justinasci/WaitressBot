import { DialogBuilder } from "./DialogBuilder";
import { Instance } from "../Models/Instance";
import { User } from "../Models/User";
import { UserOrder } from "../Models/UserOrder";
import { SelectOption } from "@slack/client";

class CancelOrderDialogBuilder extends DialogBuilder {
    set(instance: Instance, user: User ,triggerId: string): CancelOrderDialogBuilder {

        this.dialogArguments = {
            trigger_id: triggerId,
            dialog: {
                callback_id: instance.token + '_cancel',
                elements: [],
                title: 'Cancel Order'
            }
        };
        const userOrders: UserOrder[] = instance.orders.filter((o) => o.user.id === user.id);
        const formatter = (uo: UserOrder) => `${uo.id}. <@${uo.order}> ${(uo.paid)? ':+1:': ''} `;

        if(userOrders.length > 0) {
            const options: SelectOption[] = [];
            userOrders.forEach((uo) => {
                options.push( {
                    label: formatter(uo),
                    value: uo.id.toString()
                });
            });

            this.dialogArguments.dialog.elements.push({
                name: 'id',
                label: 'My orders',
                type: 'select',
                options: options
            });
        }

        return this;
    }

    hasElements(): boolean {
        return (this.dialogArguments.dialog.elements.length > 0) 
            && (this.dialogArguments.dialog.elements[0].options.length > 0);
    }
}


export { CancelOrderDialogBuilder };