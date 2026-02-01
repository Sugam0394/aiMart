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
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // password kabhi normal query me na aaye
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

} ,{timestamps: true})



 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}



userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
   
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
