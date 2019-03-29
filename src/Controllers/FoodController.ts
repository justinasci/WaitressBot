import { RestaurantResponseBuilder } from "../Responses/RestaurantResponseBuilder";
import { InstanceManager } from "../Services/InstanceManager";
import { Instance, Stage } from "../Models/Instance";
import { OrderingResponseBuilder } from "../Responses/OrderingResponseBuilder";
import { SlackApi } from "../Models/SlackApi";
import { ResponseBuilder } from "../Responses/ReponseBuilder";
import { OrderDialogBuilder } from "../Dialogs/OrderDialogBuilder";
import { CancelOrderDialogBuilder } from "../Dialogs/CancelOrderDialogBuilder";
import { RestaurantService } from "../Services/RestaurantService";

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

    processPickRestaurantEvent(action, instance: Instance, event) {
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

    orderAdd(instance: Instance, triggerId) {
        const builder = new OrderDialogBuilder().set(instance, triggerId);
        this.slackApi.web.dialog.open(builder.build()).then(r => { console.log(r)}).catch(err => console.log(err));
    }

    orderCancel(instance: Instance, event) {
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
        return true;
    }

    orderPay(instance: Instance, event) {
        const id = event.actions[0].selected_options[0].value;
        instance.toggleOrderStatus(event.user, id);
        return true;
    }

    orderRoll(instance: Instance, event) {
        const rOrder = this.instanceManager.getRandomOrder(instance);
        instance.owner = rOrder.user;
        this.slackApi.web.chat.postMessage( {
            channel: event.channel.id,
            text: `:confetti_ball: <@${rOrder.user.id}> laimejo visiem parnest valgyt! :confetti_ball::confetti_ball::confetti_ball:`
        }).then();
        instance.locked = true;
        return false;
    }

    orderToggle(instance) {
        instance.locked = !instance.locked;
        return true;
    }

    processOrderEvent(action, instance: Instance, event) {
        if (action === 'add') {
            return this.orderAdd(instance, event.trigger_id);
        }
        if (action === 'cancel') {
            return this.orderCancel(instance, event);
        }
        if (action === 'pay') {
            return this.orderPay(instance, event); 
        }
        if (event.user.id === instance.owner.id) {
            if (action === 'roll') {
                return this.orderRoll(instance, event);
            }
            if (action === 'toggle_order') {
                return this.orderToggle(instance);
            }
        }
    }

    orderUpdateMessage(instance: Instance, event) {
        const builder = new OrderingResponseBuilder();
        const orderMessage = builder.set(instance).setChannel(event.channel.id).build();
        this.slackApi.web.chat.update({ts: instance.timestampId, ...orderMessage});
    }

    parseInteractiveEvent(event) {
        const instance = this.instanceManager.get(event.callback_id);
        let action = '';

        if(event.actions[0].type === 'button') {
            action = event.actions[0].value;
        } else if (event.actions[0].type === 'select') {
            action = event.actions[0].name;
        }

        return {instance, action};
    }

    processInteractiveMessageEvent(event) {
        const {instance, action} = this.parseInteractiveEvent(event);
        if(instance) {
            if (instance.stage === Stage.PICK_RESTAURANT) {
                return this.processPickRestaurantEvent(action, instance, event);
            } else if (instance.stage === Stage.ORDERING) {
                const updateMessage = this.processOrderEvent(action, instance, event);
                if (updateMessage) {
                    this.orderUpdateMessage(instance, event);
                }
                return 
            }
        }
    }

    processDialogSubmission(event) {
        const [instanceId, command, ...args] : string = event.callback_id.split('_');
        const instance = this.instanceManager.get(instanceId);

        if (instance) {
            if (instance.stage === Stage.ORDERING) {
                if (command === 'order') {
                    instance.addOrder(event.user, event.submission);
                } else if (command === 'cancel') {
                    instance.removeOrder(event.user, event.submission);
                }
                this.orderUpdateMessage(instance, event);
            }
        }
    }

    processEvent(event): any {
        if(event.type === 'interactive_message') {
            return this.processInteractiveMessageEvent(event);
        } else if (event.type === 'dialog_submission') {
            return this.processDialogSubmission(event);
        }
        return null;
    }
}

export { FoodController };