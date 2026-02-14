import express from 'express'
 

 import { getToolById } from '../controllers/tool/toolController.js';
 import { getTrendingTools , getQuickSolution, getRecommendedTools, searchToolsController , getToolsByUseCaseController , getRisingTools } from '../controllers/tool/toolController.js';

 

const router = express.Router();


// ✅ Add request logging (helpful for debugging)
router.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`, req.query);
  next();
});//


router.get("/tools/:id",getToolById );

router.get("/trending", getTrendingTools );

router.get("/search", searchToolsController );

router.get("/useCased/:useCaseKey", getToolsByUseCaseController );

router.get('/risingTools' , getRisingTools )

router.get('/recommend' , getRecommendedTools )

router.get("/quick-solution", getQuickSolution);


export default router