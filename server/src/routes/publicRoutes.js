import express from "express";
 import { getPublicTools } from "../controllers/publicController.js";
 import { toggleSaveTool } from "../controllers/publicController.js";
 import verifyJWT from "../middlewares/auth.js";
 import { getSavedTools } from "../controllers/publicController.js";


const router = express.Router();

router.get("/public",  getPublicTools);

router.post("/save/:toolId", verifyJWT, toggleSaveTool);

router.get("/saved-tools" , verifyJWT , getSavedTools)

export default router;
