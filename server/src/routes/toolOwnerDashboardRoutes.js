 import express from 'express'
 import { createTool, getMyTools } from '../controllers/toolOwnerDashboard.js'
 import verifyJWT from '../middlewares/auth.js'
 import { authorizeRoles } from '../middlewares/roleMiddlewares.js'
 import { upload } from '../middlewares/multer.js'

 import { updateTool , deleteTool } from '../controllers/toolOwnerDashboard.js'
 

 const router = express.Router()


 router.post(
  "/createTool",
  verifyJWT,
  authorizeRoles("toolOwner"),
  upload.single("logo"),
  createTool
);


 router.get('/myTool',verifyJWT, authorizeRoles('toolOwner') , getMyTools)

 router.put(
  "/updateTool/:toolId",
  verifyJWT,
  authorizeRoles("toolOwner"),
  upload.single("logo"), // ye middleware hona chahiye
  updateTool
);


 router.delete(
  '/deleteTool/:toolId',
  verifyJWT,
  authorizeRoles("toolOwner"),
  deleteTool
);

 export default router

