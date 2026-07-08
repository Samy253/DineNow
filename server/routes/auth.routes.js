import {Router} from "express";
import { getMe, loginUser, registerUser } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";


const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.get("/me",protect, getMe)

export default authRouter