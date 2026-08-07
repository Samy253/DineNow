import "dotenv/config";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); 
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import ownerRouter from "./routes/owner.routes.js";
import adminRouter from "./routes/admin.routes.js";


const app = express()

//connect mongoDB
await connectDB()

//middleware
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (req,res) => {
    res.send('Server is live!')
})
app.use('/api/auth', authRouter)
app.use('/api/restaurants', restaurantRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/admin', adminRouter)

//global error handler
app.use((error,req,res,next) => {
    console.log("Unhandle Error : ",error)
    res.status(500).json({
        message : error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    })
})

app.listen(port, () => {
    console.log(`Server is live at port ${port}`)
})