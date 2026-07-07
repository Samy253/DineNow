import "dotenv/config";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); 
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js";



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

app.listen(port, () => {
    console.log(`Server is live at port ${port}`)
})