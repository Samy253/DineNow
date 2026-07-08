import mongoose from "mongoose";
import bcrypt from "bcrypt";

const restaurantSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    slug : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    description : {
        type : String,
        required : true,
        
    },
    cuisine : {
        type : String,
        required : true,
        trim : true
    },
    priceRange : {
        type : String,
        required : true,
        enum : ['$','$$','$$$','$$$$']
    },
    rating : {
        type : Number,
        required : true,
        default : 5.0,
        min : 1,
        max : 5
    },
    reviewCount : {
        type : Number,
        required : true,
        default : 0
    },
    location : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        default : ""
    },
    chef : {
        type : String,
        required : true,
    },
    tags : [{type : String}],
    availableSlots : [{type : String}],
    featured : {
        type : Boolean,
        default : false
    },
    exclusive : {
        type : Boolean,
        default : false
    },
    Owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref: User,
        required : true
    },
    status : {
        type : String,
        enum : ['pending','approved','rejected'],
        defualt : pending
    },
    totalSeats : {
        type : Number,
        required : true,
        default : 20
    }
},{timestamps: true})



export const Restaurant = mongoose.model("Restaurant", restaurantSchema);