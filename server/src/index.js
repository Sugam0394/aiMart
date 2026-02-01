 
 import dotenv from 'dotenv'
 dotenv.config();

 


 
 import ConnectDB from './db/index.js';
 import app from './app.js';
 
 
 


 ConnectDB()
 .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  });


 

