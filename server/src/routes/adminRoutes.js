import express from 'express'
import { createFounder } from '../controllers/adminController.js'

const router = express.Router()

router.post("/create-founder", createFounder);


export default router