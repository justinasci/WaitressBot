interface MenuItem {
    price: Number;
    item: String;
}

class Category {
    items: Array<MenuItem>;
    name: String;

    constructor() {
        this.items = new Array<MenuItem>();
    }
}

class Menu {
    categories: Array<Category>;
    constructor() {
        this.categories = new Array<Category>();
    }
}

class Restaurant {
    name: string;
    menu: Menu;
}

class RestaurantService {
    restaurants: Map<string, Restaurant>;
    constructor() {
        this.restaurants = new Map<string, Restaurant>();
        for(let i = 0; i < 5; i++) {
            const m = new Restaurant();
            m.name = i.toString();
            m.menu = new Menu();

            m.menu.categories.push(new Category(), new Category(), new Category(), new Category());
            m.menu.categories[0].name = 'padas';
            m.menu.categories[0].items.push({item: 'Lavashas', price: 4.30}, {item: 'Lekshtas', price: 4.90}, {item: 'Bomzar', price: 1.0});

            m.menu.categories[1].name = 'Padazas';
            m.menu.categories[2].items.push({item: 'Casnakinis', price: 4.30}, {item: 'Rembo', price: 4.90});

            m.menu.categories[2].name = 'Mesa';
            m.menu.categories[2].items.push({item: 'Jautiena', price: 1.20}, {item: 'Vistiena', price: 2.10});

            m.menu.categories[3].name = 'Astrumas';
            m.menu.categories[3].items.push({item: 'Bieberis', price: 1.20}, {item: 'Rembo', price: 2.10});

            
            this.restaurants.set(m.name, m);
        }
    }
    loadMenus(path: String): boolean {
        return false;
    }
    add(): boolean {
        return false;
    }
    get(name: string): Restaurant {
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