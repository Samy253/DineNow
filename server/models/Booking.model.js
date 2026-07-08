import mongoose, { ModifiedPathsSnapshot } from "mongoose";
import { User } from "./user.model";
import { Restaurant } from "./restaurant.model";
import {crypto} from "crypto"

const bookingSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    restaurant : {type : mongoose.Schema.Types.ObjectId, ref : "Restaurant", required : true},
    time : {type : String, required : true},
    date : {type : Date, required : true},
    guests : {type : Number, required : true, min : 1},
    occassion : {type : String, trim : true},
    specialRequests : {type : String, trim : true},
    status : {type : String, enum : ["confirmed", "cancelled", "completed"], default : confirmed},
    bookingId : {type : String, unique : true}
},{timestamps : true})

//auto generate a reference code on save
bookingSchema.pre("save", function (){
    if(!this.bookingId){
        this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
    }
})

export const Booking = mongoose.model("Booking",bookingSchema)