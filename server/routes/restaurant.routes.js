import { Router } from "express";
import { getFeaturedRestaurants, getRestaurantAvailability, getRestaurants, getRestaurantsBySlug } from "../controllers/restaurant.controller";

const restaurantRouter = Router()

restaurantRouter.get('/', getRestaurants)
restaurantRouter.get('/featured', getFeaturedRestaurants)
restaurantRouter.get('/:slug', getRestaurantsBySlug)
restaurantRouter.get('/:id/availability', getRestaurantAvailability)

export default restaurantRouter