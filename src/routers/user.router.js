import { Router } from 'express';
import { sample_users } from '../data.js';
import jwt from 'jsonwebtoken';
import Handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import { BAD_REQUEST } from '../constants/http_status.js';
import bcrypt from 'bcrypt';
const router = Router();



router.post("/login", Handler(
    async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.send(generateTokenReponse(user));
        }
        else {
            res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
        }

    }
))
router.post('/register', Handler(
    async (req, res) => {
        const { name, email, password, address } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(HTTP_BAD_REQUEST)
                .send('User is already exist, please login!');
            return;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false
        }

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenReponse(dbUser));
    }
))

const generateTokenReponse = user => {
    const token = jwt.sign({
        id: user.id, email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
    };
}
export default router;