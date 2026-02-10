import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'


 const ConnectDB = async() => {
    try {
        // Option 2 use karo, lekin options object mein dbName daal do 
        // Ye sabse safe method hai, URL mein kuch bhi ho, ye database name ko override kar dega.
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME, // 👈 Ye 'SugamSingh' folder hi target karega
        });

        console.log(`✅ MongoDB Connected: || DB:HOST: ${connectionInstance.connection.host}`);
        console.log(`📂 Connected to Database: ${connectionInstance.connection.name}`); 
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); 
    }
}

export default ConnectDB