import * as express from 'express';
import { Router } from './Router';
import { SlackApi } from './SlackApi';
import { FoodController } from './FoodController';
import { FoodService } from './FoodService';

const port = process.env.PORT || 8080;
const token: string = process.env.TOKEN || '';
const slackApi = new SlackApi(token);

const app = express();
const foodService: FoodService = new FoodService(slackApi);
const foodController: FoodController = new FoodController(foodService);
const router: Router = new Router(app, foodController);

app.listen(port, () => console.log(`On Port: ${port}`));
