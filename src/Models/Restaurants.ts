class MenuItem {
    price: Number;
    item: String;
}

class Category {
    items: Array<MenuItem>;
    name: String;
}

class Menu {
    categories: Array<Category>;
    constructor() {
        this.categories = new Array<Category>();
    }
}

class Restaurant {
    name: String;
    menu: Menu;
}

class RestaurantService {
    restaurants: Map<String, Restaurant>;
    constructor() {
        this.restaurants = new Map<String, Restaurant>();
        for(let i = 0; i < 5; i++) {
            const m = new Restaurant();
            m.name = i.toString();
            m.menu = new Menu();
            this.restaurants.set(m.name, m);
        }
    }
    loadMenus(path: String): boolean {
        return false;
    }
    add(): boolean {
        return false;
    }
    get(name: String): Restaurant {
        return this.restaurants.get(name);
    }
    getAll(): Array<Restaurant> {
        return Array.from(this.restaurants.values());
    }
    save(fileName: String, menu: Menu ) : boolean {
        return true;
    }

} 
export { Restaurant, RestaurantService, Menu, Category, MenuItem }