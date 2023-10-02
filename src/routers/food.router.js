import { Router } from "express";
import Handler from 'express-async-handler';
import { FoodModel } from "../models/food.model.js";
import { sample_foods, sample_tags } from "../data.js";

const router = Router();

router.get("/", Handler(
    async (req, res) => {
        const foods = await FoodModel.find();
        res.send(foods);
    }
))

router.get("/tag/:tagName", Handler(
    async (req, res) => {
        const foods = await FoodModel.find({ tags: req.params.tagName })
        res.send(foods);
    }
))

router.get("/search/:searchTerm", Handler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const foods = await FoodModel.find({ name: { $regex: searchRegex } })
        res.send(foods);
    }
))

router.get("/tags", Handler(
    async (req, res) => {
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({ count: -1 });

        const all = {
            name: 'All',
            count: await FoodModel.countDocuments()
        }

        tags.unshift(all);
        res.send(tags);
    }
))

router.get("/:foodId", Handler(
    async (req, res) => {
        const food = await FoodModel.findById(req.params.foodId);
        res.send(food);
    }
))


export default router;