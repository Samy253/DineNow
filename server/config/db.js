import mongoose from "mongoose";

const connectDB = async () => {
    try{
        console.log("URI starts with:", process.env.MONGODB_URI?.slice(0, 20));
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("MongoDB connected!")
    }catch(error){
        console.log("MongoDB connection failed!", error.message)
        process.exit(1)
    }
}

export default connectDB