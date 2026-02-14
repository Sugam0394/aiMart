import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

 app.use(

  cors({

    origin: true, // Ye dynamically request bhejnewale URL ko allow kar dega

    credentials: true,

  })

); 




app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Auth Router

import AuthRouter from './routes/authRoutes.js';

app.use("/api" , AuthRouter)


// userRouter

import userRouter from './routes/userRoute.js';

app.use("/api", userRouter)


// adminRouter

import adminRouter from './routes/adminRoutes.js';

app.use("/api" , adminRouter)


import toolOwnerRouter from "./routes/founderRoutes.js";

app.use("/api" , toolOwnerRouter )

import handleLogicRouter from './routes/toolRoutes.js';

app.use('/api', handleLogicRouter)



import OwnerRouter from '././routes/toolOwnerDashboardRoutes.js'

app.use('/api' , OwnerRouter )


import PublicRouter from './routes/publicRoutes.js';

app.use('/api' , PublicRouter)


import ExploreRouter from '../src/explore/routes/explore.routes.js';

app.use('/api', ExploreRouter);


 import reviewRouter from './routes/reviewRoutes.js'

app.use('/api', reviewRouter)

















export default app