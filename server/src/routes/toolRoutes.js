import express from 'express'
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import { getToolById } from '../controllers/tool/toolController.js';
import { getTrendingTools , getToolsByUseCaseController, getAvailableUseCases ,  getRecommendedTools, searchToolsController , getRisingTools } from '../controllers/tool/toolController.js';
import { getHomeData } from '../controllers/tool/toolController.js'
import { getWorkflowByRole } from '../controllers/tool/toolController.js';
 import { getStack } from '../controllers/tool/toolController.js';
 import { getToolsCount} from '../controllers/tool/toolController.js';

const router = express.Router();


 


router.get("/tools/:id",getToolById );

router.get("/trending", cacheMiddleware , getTrendingTools );

router.get("/search", cacheMiddleware , searchToolsController );
 
// Get All use cases for switcher
router.get('/use-cases' , cacheMiddleware , getAvailableUseCases)

// Get Tools by specific use case
router.get('/use-case/:useCaseKey' , cacheMiddleware , getToolsByUseCaseController)

router.get('/risingTools' , cacheMiddleware, getRisingTools )

router.get('/recommend' , cacheMiddleware , getRecommendedTools )

router.get('/home-data' , cacheMiddleware , getHomeData)

router.get('/workflow/:role' , cacheMiddleware , getWorkflowByRole)

router.get('/stack/:role' , cacheMiddleware , getStack)

router.get('/count' , cacheMiddleware , getToolsCount)
 


export default router