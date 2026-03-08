import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import ConnectDB from './db/index.js';

 
const startSelfPing = (port) => {
   
  const isLocal = process.env.NODE_ENV !== 'production' || !process.env.RENDER_EXTERNAL_URL;
  if (isLocal) {
    console.log('ℹ️ Self-ping skipped: Running in local environment');
    return;
  }

  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (!RENDER_URL) {
    console.log('⚠️ RENDER_EXTERNAL_URL not found, self-ping disabled');
    return;
  }

  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

  setInterval(async () => {
    try {
      const res = await fetch(`${RENDER_URL}/api/health`);
      if (res.ok) {
        console.log(`✅ Self-ping success [${new Date().toISOString()}]`);
      }
    } catch (err) {
      console.error('❌ Self-ping failed:', err.message);
    }
  }, PING_INTERVAL);

  console.log(`🏓 Self-ping started (every 14 min) → ${RENDER_URL}/api/health`);
};

const startServer = async () => {
  try {
    await ConnectDB();
  
    // 🚩 YAHAN DEFINED NAHI THA - ISSE ADD KAREIN
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running!`);
      console.log(`🏠 Local: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

      // YAHAN SIRF PRODUCTION CHECK KAREIN
      if (process.env.NODE_ENV === 'production') {
        startSelfPing(PORT);
      } else {
        console.log('ℹ️ Self-ping skipped (Not in production)');
      }
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer(); 


 

