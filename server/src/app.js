import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

  

 

const allowedOrigins = [
  "https://ai-mart-frontend.vercel.app",
  "https://ai-mart-frontend-git-main-sugam-singhs-projects.vercel.app",
  "http://localhost:5173",
  /\.vercel\.app$/  // Allow all Vercel preview URLs
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed
      if (allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      })) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// CRITICAL: Handle preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.some(allowed => {
    if (allowed instanceof RegExp) {
      return allowed.test(origin);
    }
    return allowed === origin;
  })) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.sendStatus(204);
  }
  
  next();
});

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