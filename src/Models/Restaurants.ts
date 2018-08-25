import * as fs from  'fs';

interface MenuItem {
    price: number;
    name: string;
}

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
    url: string;
    imageUrl: string;
}

class RestaurantService {
    restaurants: Map<string, Restaurant>;
    constructor() {
        this.restaurants = new Map<string, Restaurant>();
    }
    loadMenus(path: string) {
        const files = fs.readdirSync(path);
        files.forEach(fileName => {
            const file =  JSON.parse(fs.readFileSync(path + '/' + fileName, 'utf8').toString());
            const restaurant = new Restaurant();
            restaurant.name = file.name;
            restaurant.url = file.url;
            restaurant.imageUrl = file.imageUrl;
            restaurant.menu = new Menu();
            const menu = restaurant.menu;
            // 🙏🙏🙏🙏 For everyone reading this. 🙏🙏🙏🙏
            file.menu.categories.forEach(c => {
                const mCategory = new Category();
                mCategory.name = c.name;
                c.items.forEach((i, ii) => {
                    if(!i.sizes) {i.sizes = [''];}
                    i.sizes.forEach((s, si) => {
                        if(i.items) {
                            i.items.forEach((it, iti) => {
                                mCategory.items.push({
                                    name: `${(s === '')?'':s+' '}${(i.name === '')?'': i.name+' '}${it}`,
                                    price: (i.price)? i.price[si][iti] : 0
                                });
                            });
                        } else {
                            mCategory.items.push({
                                name: i.name,
                                price: (i.price)? i.price : 0
                            });
                        } 
                    });
                });
                menu.categories.push(mCategory);
            });
            this.restaurants.set(restaurant.name, restaurant);
        });
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