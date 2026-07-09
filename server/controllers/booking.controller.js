import { Booking } from "../models/Booking.model.js"
import { Restaurant } from "../models/restaurant.model.js"


//create new booking
//POST/api/bookings
//@access Pivate
export const createBooking = async (req,res) => {
    try {
        
        const {restaurantId, date, time, guests, occasion, specialRequests} = req.body
        //provide all details
        if(!restaurantId || !date || !time || !guests){
            res.status(400).json({message : "Please provide all required details for reservation"})
            return
        }
        
        //check if the restaurant exixts
        const restaurant = await Restaurant.findById(restaurantId)
        if(!restaurant){
            res.status(404).json({message : "Restaurant not found"})
            return
        }

        //verify the restaurant is approved
        if(restaurant.status !== "approved"){
            res.status(403).json({message : "Reservations for this restaurant is not open yet"})
            return
        }

        //verify seat availability
        const requestedGuests = Number(guests)
        const existingBookings = await Booking.find({
            restaurant : restaurantId,
            date : new Date(date),
            time,
            status : "confirmed"
        })
        const bookedSeats = existingBookings.reduce((sum,b) => sum + b.guests, 0) //requestedGuests is not added to DB yet so it wont be counted here
        const totalSeats = restaurant.totalSeats || 20
        const availableSeats = totalSeats - bookedSeats
        if(requestedGuests>availableSeats){
            res.status(400).json({message : `Only ${availableSeats} seats available for this time slot`})
            return
        }

        const booking = await Booking.create({
            user : req.user?._id,
            restaurant : restaurantId,
            date : new Date(date), //mongoose will turn string date into Date date anyway so you dont have to write it but its safer/clearer if done explicitly
            time,
            guests : Number(guests),
            occasion,
            specialRequests,
            status : "confirmed"
        })

        //populate restaurant info before returning
        const populatedBooking = await booking.populate("restaurant", "name location image address")
        //if you return booking as is, the frontend will get the raw id because mongodb stores object ids. to get  restaurant name, location, etc from the id you need to populate it
        res.status(201).json(populatedBooking)

    } catch (error) {
        console.error(error)
        res.status(400).json({message : error.message})
    }
}

//get logged in user bookings
//GET /api/bookings/my
//@access Pivate
export const getMyBookings = async (req,res) => {
    try {
        const bookings = await Booking.find({
            user: req.user?._id
        }).populate("restaurant", "name location image address slug").sort({date:-1, time:-1})

        res.json(bookings)
    } catch (error) {
        console.error(error)
        res.status(400).json({message : error.message})
    }
}

//cancel a booking
//PUT /api/bookings/:id/cancel
//@access Pivate
export const cancelBooking = async (req,res) => {
    try {
        
        const booking = await Booking.findById(req.params.id)
        
        //verify if the booking exists
        if(!booking){
            res.status(404).json({message : "Booking not found"})
            return
        }

        //verify the user owns the booking
        if(booking.user.toString() !== req.user?.id){
            res.status(401).json({message : "Not authorized to cancel this booking"})
            return
        }

        //user owns the booking, cancel
        booking.status = "cancelled"
        await booking.save()

        const populatedBooking = await booking.populate("restaurant", "name location image address")
        res.json(populatedBooking)

    } catch (error) {
        console.error(error)
        res.status(400).json({message : error.message})
    }
}