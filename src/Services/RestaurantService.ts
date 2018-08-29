import * as fs from 'fs';
import { Restaurant } from "../Models/Restaurant";
import { Menu } from '../Models/Menu';
import { Category } from '../Models/Category';

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

export { RestaurantService }