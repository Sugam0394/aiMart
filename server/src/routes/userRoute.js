import express from 'express'
import verifyJWT from '../middlewares/auth.js';
import {requestToolOwner , getMyToolOwnerRequest} from '../controllers/userController.js';
import { savePrompt } from '../controllers/userController.js';
import { removePrompt } from '../controllers/userController.js';
import { getSavedPrompts } from '../controllers/userController.js';


const router = express.Router();


router.post('/request-toolOwner' , verifyJWT, requestToolOwner)

router.get('/my-toolowner-request' , verifyJWT , getMyToolOwnerRequest )

 // server/src/routes/userRoute.js

router.route("/save-prompt")
  .get(verifyJWT, getSavedPrompts)   
  .post(verifyJWT, savePrompt);      


router.route("/remove-prompt/:promptId").delete(verifyJWT, removePrompt);


export default router