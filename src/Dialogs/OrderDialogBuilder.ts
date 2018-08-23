import { DialogBuilder } from "./DialogBuilder";
import { Instance } from "../Models/Instance";
import { SelectOption } from "@slack/client";

class OrderDialogBuilder extends DialogBuilder {
    set(instance: Instance, triggerId): OrderDialogBuilder {
        this.dialogArguments = {
            trigger_id: triggerId,
            dialog: {
                callback_id: instance.token,
                elements: [],
                title: 'Pick your food nibba'
            },
        };
        const menu = (instance.restaurant)? instance.restaurant.menu: null;

        if (menu) {
            menu.categories.forEach(category => {
                const options = category.items.map((item) => {
                    const t: SelectOption = {
                        label: `${item.item} | ${item.price} €`,
                        value: item.item
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
                name: 'uzsakymas',
                label: 'order',
                type: 'text',
            });
        }
        return this;
    }
}

export { OrderDialogBuilder };