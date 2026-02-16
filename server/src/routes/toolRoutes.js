import express from 'express'
 

 import { getToolById } from '../controllers/tool/toolController.js';
 import { getTrendingTools , getToolsByUseCaseController, getAvailableUseCases ,  getRecommendedTools, searchToolsController , getRisingTools } from '../controllers/tool/toolController.js';

 

const router = express.Router();


// ✅ Add request logging (helpful for debugging)
router.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`, req.query);
  next();
});//


router.get("/tools/:id",getToolById );

router.get("/trending", getTrendingTools );

router.get("/search", searchToolsController );
 
// Get All use cases for switcher
router.get('/use-cases' , getAvailableUseCases)

// Get Tools by specific use case
router.get('/use-case/:useCaseKey' , getToolsByUseCaseController)

router.get('/risingTools' , getRisingTools )

router.get('/recommend' , getRecommendedTools )
 


export default router