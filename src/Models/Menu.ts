import { Category } from './Category';


class Menu {
    categories: Array<Category>;
    dynamic?: boolean = false;
    constructor() {
        this.categories = new Array<Category>();
    }

    find(itemName: string): Category {
        return this.categories.find((item) => item.name === itemName);
    }
}

export { Menu }