import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    phone : {
        type : String,
        trim : true,
        minlength : 10
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 6
    },
    role : {
        type : String,
        enum : ["customer", "admin", "owner"],
        default : "customer"
    }
},{timestamps: true})

//hash password before saving to db
userSchema.pre("save", async function (next) {
    if(this.isModified("password"))
        this.password = await bcrypt.hash(this.password,10)
    
})

//remove password when converting to JSON
userSchema.set("toJSON", {
    transform : (doc, ret) => {
        delete ret.password;
        return ret;
    }
})

export const User = mongoose.model("User", userSchema);