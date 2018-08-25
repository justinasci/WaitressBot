interface MenuItem {
    price: number;
    name: string;
}

class Category {
    items: Array<MenuItem>;
    name: string;

    constructor() {
        this.items = new Array<MenuItem>();
    }

    find(itemName: string): MenuItem {
        return this.items.find((item) => item.name === itemName);
    }
}

class Menu {
    categories: Array<Category>;
    constructor() {
        this.categories = new Array<Category>();
    }

    find(itemName: string): Category {
        return this.categories.find((item) => item.name === itemName);
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
            m.name = 'Wrapperia_' + i.toString();
            m.menu = new Menu();

            m.menu.categories.push(new Category(), new Category(), new Category(), new Category());
            m.menu.categories[0].name = 'padas';
            m.menu.categories[0].items.push({name: 'Lavashas', price: 4.30}, {name: 'Lekshtas', price: 4.90}, {name: 'Bomzar', price: 1.0});

            m.menu.categories[1].name = 'Padazas';
            m.menu.categories[1].items.push({name: 'Casnakinis', price: 4.30}, {name: 'Rembo', price: 4.90});

            m.menu.categories[2].name = 'Mesa';
            m.menu.categories[2].items.push({name: 'Jautiena', price: 1.20}, {name: 'Vistiena', price: 2.10});

            m.menu.categories[3].name = 'Astrumas';
            m.menu.categories[3].items.push({name: 'Bieberis', price: 1.20}, {name: 'Rembo', price: 2.10});

            
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