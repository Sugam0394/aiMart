import express from 'express';

import { startExplore , handleExploreStep , completeExplore } from '../controller/exploreController.js';

const router = express.Router();

// Route to start a new explore session
router.post('/start', startExplore);

// Route to handle each step in the explore flow

router.post('/step', handleExploreStep);

// Route to complete the explore session
router.post('/complete', completeExplore);

export default router;