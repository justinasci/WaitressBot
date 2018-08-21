import * as bodyParser from 'body-parser';
import { FoodController } from './FoodController';

const responsex = {
	"response_type": "in_channel",
    "text": "Lets vote for food",
    "attachments": [
        {
            "text":"Partly cloudy today and tomorrow"
        }
    ]
};

const responsey = {
    "text": "Would you like to play a game?",
    "attachments": [
        {
            "text": "Choose a game to play",
            "fallback": "You are unable to choose a game",
            "callback_id": "wopr_game",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "game",
                    "text": "Chess",
                    "type": "button",
                    "value": "chess"
                },
                {
                    "name": "game",
                    "text": "Falken's Maze",
                    "type": "button",
                    "value": "maze"
                },
                {
                    "name": "game",
                    "text": "Thermonuclear War",
                    "style": "danger",
                    "type": "button",
                    "value": "war",
                    "confirm": {
                        "title": "Are you sure?",
                        "text": "Wouldn't you prefer a good game of chess?",
                        "ok_text": "Yes",
                        "dismiss_text": "No"
                    }
                }
            ]
        }
    ]
};

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
            const response = this.foodController.parse(req.body);
			console.log(req.body);
			//@ts-ignore TS2554
            res.json(responsey);
            return res
        });
    
        app.post('/interactive', this.urlencodedParser ,(req: Request, res: Response) => {
            const parsed = JSON.parse(req.body['payload']);
            const response = this.foodController.parse(parsed);
			console.log(parsed);
			//@ts-ignore TS2554
            res.json(responsey); 
            return res
        });
    }

 }

export { Router }