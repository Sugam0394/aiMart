import express from 'express'
 

 import { getToolById } from '../controllers/tool/toolController.js';
 import { getTrendingTools , searchToolsController , getToolsByUseCaseController } from '../controllers/tool/toolController.js';

 

const router = express.Router();


router.get("/tools/:id",getToolById );

router.get("/trending", getTrendingTools );

router.get("/search", searchToolsController );

router.get("/useCased/:useCaseKey", getToolsByUseCaseController );


export default router