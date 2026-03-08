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

  // ✅ FIXED: Changed to 8 minutes to stay ahead of Render's 15-minute spin-down
  const PING_INTERVAL = 8 * 60 * 1000; 

  const performPing = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const res = await fetch(`${RENDER_URL}/api/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        console.log(`✅ Self-ping success [${new Date().toISOString()}]`);
      } else {
        console.warn(`⚠️ Self-ping returned status ${res.status}`);
      }
    } catch (err) {
      console.error('❌ Self-ping failed:', err.message);
    }
  };

  // ✅ Initial ping 5 seconds after server starts
  setTimeout(performPing, 5000);

  // ✅ Recurring ping every 8 minutes
  const pingInterval = setInterval(performPing, PING_INTERVAL);

  console.log(`🏓 Self-ping started: Interval: 8 minutes, Target: ${RENDER_URL}/api/health`);

  // ✅ Cleanup on process exit
  process.on('SIGTERM', () => clearInterval(pingInterval));
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


 

