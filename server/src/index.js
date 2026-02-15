import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import ConnectDB from './db/index.js';

const startServer = async () => {
  try {
    await ConnectDB();
  
    // 🚩 YAHAN DEFINED NAHI THA - ISSE ADD KAREIN
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running!`);
      console.log(`🏠 Local: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer(); 


 

