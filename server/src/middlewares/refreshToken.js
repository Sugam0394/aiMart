 import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
};

const generateToken = asyncHandler(async(req , res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
  
  if (!incomingToken) {
    throw new ApiError(401 , 'UnAuthorized request');
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

  // 2️⃣ Find user (Add-on: prevRefreshToken aur IssuedAt select kiya)
  const user = await User.findById(decoded.userId).select("+refreshToken +prevRefreshToken +refreshTokenIssuedAt");

  // 🚀 ADD-ON: RACE CONDITION LOGIC
  // Check 1: Kya ye current token hai?
  const isCurrentToken = user.refreshToken === incomingToken;
  
  // Check 2: Kya ye purana token hai jo abhi-abhi rotate hua hai? (30 sec grace window)
  const isGracePeriodActive = (Date.now() - new Date(user.refreshTokenIssuedAt || 0).getTime()) < 30000;
  const wasPreviousToken = user.prevRefreshToken === incomingToken && isGracePeriodActive;

  // Agar dono galat hain, toh hi 401 do
  if (!user || (!isCurrentToken && !wasPreviousToken)) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }

  // 3️⃣ Generate new tokens
  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // 🚀 ADD-ON: ROTATION UPDATE
  // Naya token dene se pehle purane ko prevRefreshToken mein save karo grace window ke liye
  user.prevRefreshToken = incomingToken; 
  user.refreshToken = newRefreshToken;
  user.refreshTokenIssuedAt = Date.now();
  await user.save({ validateBeforeSave: false });

  // ✅ Use dynamic cookie options
  const cookieOptions = getCookieOptions();

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 6️⃣ Send access token in response
  return res.status(200).json(
    new ApiResponse(
      200,
      { accessToken },
      "Access token refreshed successfully"
    )
  );
});

export default generateToken;