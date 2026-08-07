import jwt from "jsonwebtoken"
import { Restaurant } from "../models/restaurant.model.js"
import { User } from "../models/user.model.js"
import { Booking } from "../models/Booking.model.js"

//get all restaurants with search and filters
//GET /api/restaurants
export const getRestaurants = async (req,res) => {
    try {
        const {search, priceRange, rating, location, sort} = req.query

        //build query object
        const queryObj = {status : "approved"}

        if(search){
            queryObj.$or = [
                {name : {$regex : search, $options : "i"}},
                {tags : {$regex : search, $options : "i"}},
                {location : {$regex : search, $options : "i"}}
            ]
        }

        if(priceRange){
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange]
            queryObj.priceRange = {$in : prices}
        }

        if(rating){
            queryObj.rating = {$gte : Number(rating)}
        }

        if(location){
            queryObj.location = {$regex : location, $options : "i"}
        }
        //sorting
        let sortOption;
        if(sort === "rating"){
            sortOption = {rating: -1}
        }else if (sort === "price_low"){
            sortOption = {priceRange : 1}
        }else if(sort === "price_high"){
            sortOption = {priceRange: -1}
        }

        const restaurant = await Restaurant.find(queryObj).sort(sortOption)
        res.json(restaurant)
    } catch (error) {
        console.log(error)
        res.status(400).json({message : error.message})
    }
}
//get featured and exclusive restaurants 
//GET /api/restaurants/featured
export const getFeaturedRestaurants = async (req,res) => {
    try {
        const featured = await Restaurant.find({
            status: "approved",
            $or : [{featured : true}, {exclusive : true}]
        }).limit(6)
        res.json(featured)
    } catch (error) {
        console.log("Get Featured Restaurant Error : ", error)
        res.status(500).json({message : "Server Error"})
    }
}
//get single restaurant by slug
//GET /api/restaurants/:slug
export const getRestaurantsBySlug = async (req,res) => {
    try {
        const restaurant = await Restaurant.findOne({ slug : req.params.slug })
        if(!restaurant){
            res.status(404).json({ message: "Restaurant not found"})
            return
        }

        //if not approved, verify authorization (owner or admin)
        if(restaurant.status !== "approved"){
            let isAuthorized = false
            if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
                try {
                    const token = req.headers.authorization.split(" ")[1]
                    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

                    const user = await User.findById(decoded.id)

                    if(user && (user.role === "admin" || (user.role === "owner" &&restaurant.Owner.toString() === user._id.toString()))){
                        isAuthorized = true
                    }
                } catch (error) {
                    //ignore token verify error
                }
            }
            if(!isAuthorized){
                res.status(404).json({message : "Restaurant not found or pending approval"})
                return
            }
        }
        res.json(restaurant)
    } catch (error) {
        console.log(error)
        res.status(400).json({message : error.message})
    }
}
//get dynamic seat availability for slots
//GET /api/restaurants/:id/availability
export const getRestaurantAvailability = async (req,res) => {
    console.log("Availability route hit");
    console.log(req.params);
    console.log(req.query);
    try {
        const {date} = req.query
        if(!date){
            res.status(400).json({message : "Please provide a date"})
            return
        }
        const restaurant = await Restaurant.findById(req.params.id)
        if(!restaurant){
            res.status(404).json({message : "Restaurant not found"})
            return
        }

        const bookingDate = new Date(date).toString()

        //get all active bookings on this date for the restaurant
        const bookings = await Booking.find({
            restaurant : restaurant._id,
            date : bookingDate,
            status : "confirmed"
        })

        //map slots to available capacities
        const availablility = restaurant.availableSlots.map((slot) => {
            const bookedSeats = bookings.filter((book) => book.time === slot).reduce((sum,book) => sum + book.guests, 0)

            const totalSeats = restaurant.totalSeats || 20

            const availableSeats = Math.max(0, totalSeats - bookedSeats)

            return {
                time : slot,
                availableSeats,
                isAvailable : availableSeats>0
            }
        })
        res.json(availablility)
    } catch (error) {
        console.log(error)
        res.status(400).json({message : error.message})
    }
}