import express from 'express'
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import { getToolById } from '../controllers/tool/toolController.js';
import { getTrendingTools , getToolsByUseCaseController, getAvailableUseCases ,  getRecommendedTools, searchToolsController , getRisingTools } from '../controllers/tool/toolController.js';

 

const router = express.Router();


// ✅ Add request logging (helpful for debugging)
router.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`, req.query);
  next();
});//


router.get("/tools/:id",getToolById );

router.get("/trending", cacheMiddleware , getTrendingTools );

router.get("/search", cacheMiddleware , searchToolsController );
 
// Get All use cases for switcher
router.get('/use-cases' , cacheMiddleware , getAvailableUseCases)

// Get Tools by specific use case
router.get('/use-case/:useCaseKey' , cacheMiddleware , getToolsByUseCaseController)

router.get('/risingTools' , cacheMiddleware, getRisingTools )

router.get('/recommend' , cacheMiddleware , getRecommendedTools )
 


export default router