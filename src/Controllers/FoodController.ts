import { RestaurantService } from "../Models/Restaurants";
import { RestaurantResponseBuilder } from "../Responses/RestaurantResponseBuilder";
import { InstanceManager } from "../Services/InstanceManager";
import { Instance, Stage } from "../Models/Instance";
import { OrderingResponseBuilder } from "../Responses/OrderingResponseBuilder";
import { SlackApi } from "../Models/SlackApi";
import { ResponseBuilder } from "../Responses/ReponseBuilder";
import { User } from "../Models/User";
import { OwnerControllsResponseBuilder }from'../Responses/OwnerControllsResponseBuilder'
import { OrderDialogBuilder } from "../Dialogs/OrderDialogBuilder";
import { CancelOrderDialogBuilder } from "../Dialogs/CancelOrderDialogBuilder";

class FoodController {
    restaurantService: RestaurantService;
    instanceManager: InstanceManager; 
    slackApi: SlackApi;

    constructor(restaurantService: RestaurantService, instanceManager: InstanceManager, slackApi: SlackApi) {
        this.restaurantService = restaurantService;
        this.instanceManager = instanceManager;
        this.slackApi = slackApi;
    } 

    startOrderInstance(request): any {
        const restaurants = this.restaurantService.getAll();
        const instance = new Instance();
        instance.owner = {id: request.user_id, name: request.user_name};
        this.instanceManager.add(instance);
        return new RestaurantResponseBuilder().set(restaurants, instance.token).build();
    }

    updateOrder(instance: Instance) {

    }

    processEvent(event): any {
        console.log(event);
        if(event.type === 'interactive_message') {
            const instance = this.instanceManager.get(event.callback_id);
            let action = '';

            if(event.actions[0].type === 'button') {
                action = event.actions[0].value;
            } else if (event.actions[0].type === 'select') {
                action = event.actions[0].name;
            }
           
            if (instance) {
                if(instance.stage === Stage.PICK_RESTAURANT) {
                    this.instanceManager._handlePickStageEvent(instance, event);
                    const builder = new OrderingResponseBuilder();
                    const orderMessage = builder.set(instance).setChannel(event.channel.id).build();
                    // const ownerMessage = new OwnerControllsResponseBuilder().set(instance).setChannel(event.channel.id).build();

                    this.slackApi.web.chat.postMessage(orderMessage).then((r) => {
                        //@ts-ignore, Ignoring 'non existant' timestap id.
                        instance.timestampId = r.ts;
                        //@ts-ignore, Ignoring 'non existant' timestap id.
                        // this.slackApi.web.chat.postMessage(ownerMessage).then((r) => {instance.ownerControllsId = r.ts});
                    });
                    return ResponseBuilder.deleteMessage();
                }

                if (instance.stage === Stage.ORDERING) {
                    if(action === 'add') {
                        const builder = new OrderDialogBuilder().set(instance, event.trigger_id);
                        this.slackApi.web.dialog.open(builder.build()).then(r => { console.log(r)}).catch(err => console.log(err));
                    } else if (action === 'cancel') {
                        const builder = new CancelOrderDialogBuilder().set(instance, event.user, event.trigger_id);
                        if(builder.hasElements()) {
                            this.slackApi.web.dialog.open(builder.build()).then(r => { console.log(r)}).catch(err => console.log(err));
                        } else {
                            this.slackApi.web.chat.postEphemeral( {
                                channel: event.channel.id,
                                user: event.user.id,
                                text: 'You have no orders'
                            }).then((r) => console.log(r));
                        }
                    } else if (action === 'pay') {
                        const id = event.actions[0].selected_options[0].value;
                        instance.toggleOrderStatus(event.user, id);
                        const builder = new OrderingResponseBuilder();
                        const orderMessage = builder.set(instance).setChannel(event.channel.id).build();
                        this.slackApi.web.chat.update({ts: instance.timestampId, ...orderMessage});
                    } else if (event.user.id === instance.owner.id) {
                        if (action === 'roll' && instance.orders.length > 0) {
                            const rOrder = this.instanceManager.getRandomOrder(instance);
                            this.slackApi.web.chat.postMessage( {
                                channel: event.channel.id,
                                text: `:confetti_ball: <@${rOrder.user.id}> laimejo visiem parnest valgyt! :confetti_ball::confetti_ball::confetti_ball:`
                            }).then();
                        } else if (action === 'close_new') {
                            instance.locked = true;
                        } else {
                            return null;
                        }
                        const builder = new OrderingResponseBuilder();
                        const orderMessage = builder.set(instance).setChannel(event.channel.id).build();
                        this.slackApi.web.chat.update({ts: instance.timestampId, ...orderMessage});
                    }
                }
            }
        } else if (event.type === 'dialog_submission') {
            const [instanceId, command, ...args] : string = event.callback_id.split('_');
            const instance = this.instanceManager.get(instanceId);
            if (instance) {
                if (instance.stage === Stage.ORDERING) {
                    if(command === 'order') {
                        instance.addOrder(event.user, event.submission);
                    } else if ( command === 'cancel') {
                        instance.removeOrder(event.user, event.submission);
                    }
                    const builder = new OrderingResponseBuilder();
                    const orderMessage = builder.set(instance).setChannel(event.channel.id).build();
                    this.slackApi.web.chat.update({ts: instance.timestampId, ...orderMessage});
                }
            }
        }
        return null;
    }
}

export { FoodController };