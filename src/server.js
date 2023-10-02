import dotenv from "dotenv"
dotenv.config();

import express from "express";
import cors from "cors"
import { dbConnect } from "./configs/database.config.js";
dbConnect();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["https://localhost:3000"]
}));


import { sample_foods } from "./data.js";
app.get('/', (req, res) => {
    res.send(sample_foods);
})
//Routers
import foodRouter from './routers/food.router.js'
app.use('/food', foodRouter);
import userRouter from './routers/user.router.js';
app.use('/user', userRouter);
import orderRouter from './routers/order.router.js';
app.use("/orders", orderRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})