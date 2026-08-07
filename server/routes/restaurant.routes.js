import { Router } from "express";
import { getFeaturedRestaurants, getRestaurantAvailability, getRestaurants, getRestaurantsBySlug } from "../controllers/restaurant.controller.js";

const restaurantRouter = Router()
restaurantRouter.get("/test", (req, res) => {
    res.json({ message: "Restaurant route works" });
});

restaurantRouter.get('/', getRestaurants)
restaurantRouter.get('/featured', getFeaturedRestaurants)
restaurantRouter.get('/:id/availability', getRestaurantAvailability)
restaurantRouter.get('/:slug', getRestaurantsBySlug)

export default restaurantRouter