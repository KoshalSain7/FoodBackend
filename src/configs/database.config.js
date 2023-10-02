import { connect, set } from "mongoose";

set('strictQuery', true);

export const dbConnect = async () => {
    connect(process.env.MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => {
        console.log("Database Connected 😍");
    }).catch((error) => {
        console.log("Error In DB Connection 🥲", error);
    })
}