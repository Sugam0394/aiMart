import express from 'express';

import { startExplore , handleExploreStep , completeExplore } from '../controller/exploreController.js';
import { PromptService } from '../services/promptServices.js';
const router = express.Router();

// Route to start a new explore session
router.post('/start', startExplore);

// Route to handle each step in the explore flow

router.post('/step', handleExploreStep);

// Route to complete the explore session
router.post('/complete', completeExplore);

 
 router.post('/generate-prompts', async (req, res) => {
  try {
    const { role, task, tools } = req.body;
    
    // Check agar data missing hai
    if (!role || !task || !tools) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const prompts = PromptService.generateToolPrompts(role, task, tools);
    res.json({ success: true, prompts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;