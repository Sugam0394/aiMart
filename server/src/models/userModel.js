import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({

 // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    }, 
     email: {
    type: String,
    required: true, // 👈 Ye HAMESHA true rahega
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: function() {
      // 💡 Pro Logic: Agar user Google se nahi aaya, tabhi password required hai
      return !this.googleId; 
    },
    select: false,
  },

  googleId: {
    type: String,
    required: false, // Sirf Google users ke liye hoga
    unique: true,
    sparse: true, // Taaki normal users ko null ki wajah se unique error na aaye
  },
  

    profilePicture: {
      type: String,
      default: "",
    },

 // Role System
    role: {
      type: String,
      enum: ["user", "toolOwner", "founder"],
      default: "user",
    },

    requestedRole: {
      type: String,
      enum: ["toolOwner"],
      default: null,
    },

    roleStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },

 // Auth Tokens
    refreshToken: {
      type: String,
    },
    savedTools: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tool",
  }
],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

} ,{timestamps: true})



 
 userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}



userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      role: this.role, // future ready
   
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};





 const User = mongoose.model("User", userSchema);
export default User;
