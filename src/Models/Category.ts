import { MenuItem } from "./MenuItem";

class Category {
    items: Array<MenuItem>;
    name: string;
    optional: boolean

    constructor() {
        this.items = new Array<MenuItem>();
        this.optional = false;
    }

    find(itemName: string): MenuItem {
        return this.items.find((item) => item.name === itemName);
    }
}

export { Category }