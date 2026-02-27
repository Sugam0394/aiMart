import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

  
 const allowedOrigins = [
 process.env.CLIENT_URL,
  "http://localhost:5173" ,         
];

 app.use(cors({
  origin: function (origin, callback) {
    // Postman ya bina origin wali calls allow karne ke liye
    if (!origin) return callback(null, true);

    const isVercel = /\.vercel\.app$/.test(origin);
    if (allowedOrigins.includes(origin) || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked this request!'));
    }
  },
  credentials: true
}));

// ✅ NEW: Google OAuth postMessage fix (Ye lines add ki hain)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
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

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

 
    
 

 

















export default app