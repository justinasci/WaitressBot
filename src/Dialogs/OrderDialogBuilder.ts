import { DialogBuilder } from "./DialogBuilder";
import { Instance } from "../Models/Instance";
import { SelectOption } from "@slack/client";

class OrderDialogBuilder extends DialogBuilder {
    set(instance: Instance, triggerId: string): OrderDialogBuilder {
        this.dialogArguments = {
            trigger_id: triggerId,
            dialog: {
                callback_id: instance.token + '_order',
                elements: [],
                title: 'Order'
            },
        };
        const menu = (instance.restaurant)? instance.restaurant.menu: null;

        if (menu) {
            menu.categories.forEach(category => {
                const options = category.items.map((item) => {
                    const t: SelectOption = {
                        label: `${item.name} | ${item.price} €`,
                        value: item.name
                    }
                    return t;
                })
                this.dialogArguments.dialog.elements.push({
                    name: category.name,
                    label: category.name,
                    type: 'select',
                    options: options
                });
            });
            
        } else {
            this.dialogArguments.dialog.elements.push({
                name: 'order',
                label: 'Order',
                type: 'text',
            });
        }

        this.dialogArguments.dialog.elements.push({
            name: 'comment',
            label: 'Comment',
            type: 'text',
            optional: true
        });

        return this;
    }
}

export { OrderDialogBuilder };