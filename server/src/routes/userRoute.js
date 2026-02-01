import express from 'express'
import verifyJWT from '../middlewares/auth.js';
import {requestToolOwner , getMyToolOwnerRequest} from '../controllers/userController.js';



const router = express.Router();


router.post('/request-toolOwner' , verifyJWT, requestToolOwner)

router.get('/my-toolowner-request' , verifyJWT , getMyToolOwnerRequest )


export default router