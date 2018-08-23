import * as bodyParser from 'body-parser';
import { FoodController } from './Controllers/FoodController';

 class Router {
	foodController: FoodController;
	urlencodedParser = bodyParser.urlencoded({ extended: false });
	jsonParser = bodyParser.json();

	constructor(app: any,foodController: FoodController) {
		this.foodController = foodController;
	
		app.post('/food', this.urlencodedParser,(req: Request, res: Response) => {
			const response = foodController.startOrderInstance(req.body);
			//@ts-ignore TS2554, Express TS bindins error
			res.json(response);
			return res;
		});
	
		app.post('/interactive', this.urlencodedParser ,(req: Request, res: Response) => {
			const parsed = JSON.parse(req.body['payload']);
			const processed = foodController.processEvent(parsed);
			if(processed) {
				//@ts-ignore TS2554, Express TS bindins error
				res.json(processed); 
			} else {
				//@ts-ignore
				res.status(200);
			}

			return res;
		});
	}

 }

export { Router }