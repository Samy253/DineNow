import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(true); // forces it to read CLOUDINARY_URL from env

export default cloudinary;