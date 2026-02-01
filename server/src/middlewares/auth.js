import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'
 import User from '../models/userModel.js'
import asyncHandler from '../utils/asyncHandler.js'

const verifyJWT = asyncHandler(async(req , res, next) => {


    const token = req.headers.authorization?.replace("Bearer ", "");

    if(!token){
         throw new ApiError(401, "Unauthorized request");
    }

    let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

   const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

   req.user = user;
    next();


})

export default verifyJWT