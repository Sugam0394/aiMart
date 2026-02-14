import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'



const generateToken = asyncHandler(async(req , res) => {

    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!incomingToken) {
        throw new ApiError(401 , 'UnAuthorized reguest')
    }

   
  // 1️⃣ Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }


    // 2️⃣ Find user
  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user || user.refreshToken !== incomingToken) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }

   // 3️⃣ Generate new tokens
  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });


    

    const options = {
        httpOnly : true,
        secure : true,          // localhost ke liye false
        sameSite: "none",
    };


 res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: true, // localhost
  sameSite: "none",
  maxAge: 15 * 60 * 1000, // 15 min
});

res.cookie("refreshToken", newRefreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});



  // 6️⃣ Send access token in response
  return res.status(200).json(
    new ApiResponse(
      200,
      { accessToken },
      "Access token refreshed successfully"
    )
  );


 

    //return res.status(200)
    //.clearCookie('accessToken' , accessToken , options)
   // .clearCookie('refreshToken' , newRefreshToken , options)
    //.json(new ApiResponse(
     //   200 ,
    //    { accessToken , refreshToken : newRefreshToken},
       // "Access token refreshed successfully"
   // ))
})

export default generateToken