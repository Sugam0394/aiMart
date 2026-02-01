import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'



export const createFounder = asyncHandler(async(req , res) => {

     const { name, email, password, secretKey } = req.body;

      // 🔐 secret protection
      if (secretKey !== process.env.FOUNDER_SECRET) {
    throw new ApiError(403, "Unauthorized");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
 

  const founder = await User.create({
    name,
    email,
    password,
    role: "founder",
    isEmailVerified: true,
  });

   res.status(201).json({
    success: true,
    message: "Founder created successfully",
    data: {
      id: founder._id,
      email: founder.email,
      role: founder.role,
    },
  });










})