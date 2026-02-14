import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from '../models/userModel.js'



 
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction,  // TRUE on Render, FALSE on localhost
    sameSite: isProduction ? 'none' : 'lax',  // CRITICAL for cross-origin
    path: '/'
  };
};




const registerUser = asyncHandler(async(req , res) => {
    const { name , email , password} = req.body;


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!emailRegex.test(email)) {
  throw new ApiError(400, "Invalid email format");
}


     // 1. Validate input
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

   // 2. Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password
  });

const accessToken = user.generateAccessToken();

const refreshToken = user.generateRefreshToken();


user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });


  // ✅ Use dynamic cookie options
    const cookieOptions = getCookieOptions();

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });


 

return res.status(201).json(
  new ApiResponse(
    201,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    },
    "User registered Successfully"
  )
);




























})

const loginUser = asyncHandler(async(req , res) => {
  const { email , password} = req.body

   // 1️⃣ Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }


  // 2️⃣ Find user (password explicitly select)
  const user = await User.findOne({ email }).select("+password +refreshToken");

 if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

   // 3️⃣ Compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }


 

   // 5️⃣ Token rotation
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });


 
  const cookieOptions = getCookieOptions();

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });


return res.status(200).json(
  new ApiResponse(
    200,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      
    },
    "Login successful"
  )
);




})
const logoutUser = asyncHandler(async(req , res) => {


const userId = req.user._id;

await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true }
  );

 // ✅ Use dynamic cookie options for clearing
  const cookieOptions = getCookieOptions();

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);



return res.status(200).json(
  new ApiResponse(200, {}, "Logout successful")
);







})

 const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "_id name email role"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { user }, "User fetched successfully")
  );
});

// 1️⃣ Get current user profile (already logged in)

  const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "_id name email role profilePicture"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "Profile fetched successfully")
  );
});

 
 const updateProfile = asyncHandler(async (req, res) => {
  const { name, profilePicture } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (name) user.name = name;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();

  return res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully")
  );
});



 


export {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    getProfile,
    updateProfile
}
