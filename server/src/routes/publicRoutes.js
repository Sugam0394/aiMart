import express from "express";
 import { getPublicTools } from "../controllers/publicController.js";

const router = express.Router();

router.get("/public", getPublicTools);

export default router;
