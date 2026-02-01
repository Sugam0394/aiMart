import { Router } from 'express'
import { loginUser, logoutUser,  registerUser, getMe } from '../controllers/authController.js'
import verifyJWT from '../middlewares/auth.js'
import generateToken from '../middlewares/refreshToken.js'
 import { getProfile , updateProfile } from '../controllers/authController.js'

const router = Router()

router.route("/register").post(registerUser)
router.route("/login" ).post(loginUser)
router.route("/logout").post( verifyJWT, logoutUser)
router.route("/refreshToken").post(generateToken)

router.get("/me", verifyJWT, getMe)

router.get("/profile", verifyJWT, getProfile)

router.put("/profileUpdate", verifyJWT, updateProfile)




export default router