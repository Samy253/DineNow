import express from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import bcrypt from "bcrypt"

//helper to generate jwt token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_TOKEN_SECRET, {expiresIn : process.env.JWT_TOKEN_EXPIRY})
}

//register a new user
//POST /api/auth/register
export const registerUser = async(req,res) => {
    try{
        const {name, email, phone, password, role} = req.body

        if(!name||!email||!password){
            res.status(400).json({message : "Please enter all required fields"})
            return
        }

        //check if the user already exists
        const userExists = await User.findOne({email})
        if(userExists){
            res.status(400).json({message : "User already exists"})
            return
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create user
        const user = await User.create({
            name,
            email,
            phone,
            password : hashedPassword,
            role
        })
        if(user){
            res.status(201).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone,
                role : user.role,
                token : generateToken(user._id.toString())
            })
        }else{
            res.status(400).json({message: "Invalid user data"})
        }
    } catch (error){
        console.log(error)
        res.status(400).json({message : error.message})
    }
}

//authenticate a user & get token
// POST api/auth/login
export const loginUser = async(req,res) => {
    try{
        
        const {email, password} = req.body

        if(!email||!password){
            res.status(400).json({message : "Please provide email and password"})
            return
        }

        //check for user
        const user = await User.findOne({email})
        if(!user){
            res.status(401).json({message: "Invalid email or password"})
            return
        }

        //check if the password matches
        const isMatch = await bcrypt.compare(password, user.password|| "")
        if(!isMatch){
            res.status(401).json({message : "Invalid email or password"})
            return
        }
        //password also matched
        res.json({
                _id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone,
                role : user.role,
                token : generateToken(user._id.toString())
        })

    }catch(error){
        console.log(error)
        res.status(400).json({message : error.message})
    }
    
}

//get user profile
//GET /api/auth/me
export const getMe = async(req,res) => {
    try{
        if(!req.user){
            res.status(401).json({message : "Not Authorized"})
            return   
        }
        res.json(req.user)
    }catch(error){
        console.log(error)
        res.status(400).json({message : error.message})
    }
    
}