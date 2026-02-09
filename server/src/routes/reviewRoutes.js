import Router from 'express'
import { createReview } from '../controllers/reviewController.js'
import verifyJWT from '../middlewares/auth.js'


const router = Router()

// Placeholder for review-related routes
// expert Audit hai to review create karne ka route
router.post("/createReview" , verifyJWT, createReview)


export default router