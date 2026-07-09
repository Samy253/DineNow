
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async(req, res, next) => {
    let token
    if(req.headers.authorization &&req.headers.authorization.startsWith("Bearer")){
        try {
            //get token from header
            token = req.headers.authorization.split(" ")[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

            //get user from the token, exclude password
            const user = await User.findById(decoded.id).select("-password")
            if(!user){
                res.status(401).json({message : "Not authorized, user not found"})
                return
            }
            req.user = user
            next()
        } catch (error) {
            console.log("Auth Middleware Error : ", error)
            res.status(403).json({message : "Not Authorized, token failed"})
            return
        }
        if(!token){
            res.status(403).json({message : "Not Authorized, No Token"})
        }
    }
}

//middlewares for admin and restaurant owners
export const adminOnly = (req,res) => {
    if(req.user && req.user.role === "admin")
        next()
    else res.status(400).json({message : "Access Denied, Admin Only"})
}
//admin can also access owner dashboard
export const ownersOnly = (req,res) => {
    if(req.user && req.user.role === "owner" || req.user.role === "admin")
        next()
    else res.status(400).json({message : "Access Denied, Owner role required"})
}
