import * as bodyParser from 'body-parser';
import { FoodController } from './Controllers/FoodController';

 class Router {
	foodController: FoodController;
	urlencodedParser = bodyParser.urlencoded({ extended: false });
	jsonParser = bodyParser.json();

	constructor(app: any,foodController: FoodController) {
		this.foodController = foodController;

		app.get('/food', (req, res) => {
			console.log(req.query.id);
			return res.send(req);
		});
	
		app.post('/food', this.urlencodedParser,(req: Request, res: Response) => {
			console.log(req.body);
			const response = foodController.startOrderInstance(req.body);
			//@ts-ignore TS2554, Express TS bindins error
			res.json(response);
			return res
		});
	
		app.post('/interactive', this.urlencodedParser ,(req: Request, res: Response) => {
			const parsed = JSON.parse(req.body['payload']);
			const processed = foodController.processEvent(parsed);
			//@ts-ignore TS2554, Express TS bindins error
			res.json(processed); 
			return res
		});
	}

 }

export { Router }