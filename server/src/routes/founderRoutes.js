import express from 'express'
import verifyJWT from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddlewares.js';
 import { getPendingToolOwnerRequests, handleToolOwnerRequest, getApprovedToolOwnerRequests  } from '../controllers/founderController.js';
import { getPendingTools , approveTool , rejectTool , getApprovedTools } from '../controllers/founderController.js';

 


const router = express.Router();

// only founder get access

router.get(
  "/toolowner-requests",
  verifyJWT,
  authorizeRoles("founder"),
  getPendingToolOwnerRequests
);


router.patch(
  "/toolowner-requests/:requestId",
  verifyJWT,
  authorizeRoles("founder"),
  handleToolOwnerRequest
);

router.get(
  "/toolowner-requests/approved",
  verifyJWT,
  authorizeRoles("founder"),
  getApprovedToolOwnerRequests
);




router.get('/pendingTool', verifyJWT , authorizeRoles('founder'), getPendingTools)

router.patch('/approve/:toolId' , verifyJWT , authorizeRoles('founder'), approveTool )

 router.patch('/reject/:toolId' , verifyJWT , authorizeRoles('founder'), rejectTool )

 router.get('/approvedTool' , verifyJWT , authorizeRoles('founder'), getApprovedTools )


  


export default router