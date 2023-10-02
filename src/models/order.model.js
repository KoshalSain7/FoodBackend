import { model, Schema, Types } from 'mongoose';
import { OrderStatus } from '../constants/order_status.js';
import { FoodSchema } from './food.model.js';


export const LatLngSchema = new Schema(
    {
        lat: { type: String, required: true },
        lng: { type: String, required: true },
    }
);

export const OrderItemSchema = new Schema(
    {
        food: { type: FoodSchema, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
);

OrderItemSchema.pre('validate', function (next) {
    this.price = this.food.price * this.quantity;
    next();
});

const orderSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        addressLatLng: { type: LatLngSchema, required: true },
        paymentId: { type: String },
        totalPrice: { type: Number, required: true },
        items: { type: [OrderItemSchema], required: true },
        status: { type: String, default: OrderStatus.NEW },
        user: { type: Schema.Types.ObjectId, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

export const OrderModel = model('order', orderSchema);