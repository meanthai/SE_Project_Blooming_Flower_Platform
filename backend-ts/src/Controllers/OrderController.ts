import Stripe from "stripe";
import { Response, Request } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(
    process.env.STRIPE_API_KEY as string
);

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckoutSessionRequestType = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];

    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };

    restaurantId: string;
}

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequestType, menuItems: MenuItemType[]) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((menuItem) => menuItem._id.toString() === cartItem.menuItemId.toString());

        if(!menuItem){
            throw new Error(`menu item not found while creating checkout session:  ${cartItem.menuItemId}`);
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "gbp",
                unit_amount: menuItem.price,
                product_data: {
                    name: menuItem.name,
                }
            },
            quantity: parseInt(cartItem.quantity)
        };

        return line_item; 
    });

    return lineItems;
}

const createSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string,
    deliveryPrice: number,
    restaurantId: string
  ) => {

    const sessionData = await STRIPE.checkout.sessions.create({
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Delivery",
            type: "fixed_amount",
            fixed_amount: {
              amount: deliveryPrice,
              currency: "gbp",
            },
          },
        },
      ],
      mode: "payment",
      metadata: {
        orderId,
        restaurantId,
      },
      success_url: `${FRONTEND_URL}/order-status?success=true`,
      cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    });
  
    return sessionData;
  };

const stripeWebhookHandler = async(req: Request, res: Response) => {
    let event;
    try {
        const sig = req.headers["stripe-signature"];

        event = STRIPE.webhooks.constructEvent(req.body, sig as string, STRIPE_ENDPOINT_SECRET);
    } catch(error: any) {
        console.log("Error while handling stripe webhook: ", error);
        return res.status(400).send(`Stripe webhook error: ${error.message}`);
    }

    if(event?.type == "checkout.session.completed") {
        const order = await Order.findById(event.data.object.metadata?.orderId);

        if(!order){
            return res.status(404).json({
                message: "Order not found from stripeWebhookHandler!"
            });
        }

        order.totalAmount = event.data.object.amount_total;
        console.log("Order total amount: ", event.data.object.amount_total );
        order.status = "paid";

        await order.save();
    }

    res.status(200).send();
}

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequestType = req.body;

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);

        if(!restaurant){
            throw new Error("Restaurant not found while creating checkout session!");
        }

        const newOrder = new Order({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        })

        let totalCost = 0;

        for(const cartItem of newOrder.cartItems){
            for(const menuItem of restaurant.menuItems){
                if(cartItem.menuItemId === menuItem._id.toString()){
                    totalCost += menuItem.price * cartItem.quantity;
                    break;
                }
            }
        }

        newOrder.totalAmount = totalCost;

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);

        const session = await createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());

        if(!session.url){
            return res.status(500).json({
                message: "Error creating stripe session!",
            });
        }

        await newOrder.save();

        res.json({
            url: session.url,
        })

    } catch(err: any) {
        console.log("Error while creating Checkout Session: ", err);
        res.status(500).json({
            message: err.message.raw
        });
    }
}


const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate("restaurant").populate("user");

        console.log("orders found: ", orders)

        res.json(orders);

    } catch(error: any) {
        console.log("Error while getting your orders!", error);
        res.status(500).json({
            message: error.message,
        })
    }
}

export default {
    createCheckoutSession: createCheckoutSession as any,
    stripeWebhookHandler: stripeWebhookHandler as any,
    getMyOrders: getMyOrders as any,
}