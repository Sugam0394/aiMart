 import dns from 'dns'

// Force Google's DNS resolvers so mongodb+srv:// SRV lookups
// don't fail/hang on ISPs or networks with unreliable default DNS.
dns.setServers(["8.8.8.8", "8.8.4.4"])

import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'


 const ConnectDB = async () => {
    try {
        // ✅ Connection Pooling options add kiye hain
        const connectionOptions = {
            dbName: DB_NAME,
            maxPoolSize: 10, // Ek saath 10 connections rakhega (fast response)
            minPoolSize: 2,  // Hamesha 2 connection ready rakhega (no cold start)
            serverSelectionTimeoutMS: 5000, // 5s mein fail hona better hai bajaye hang hone ke
            socketTimeoutMS: 45000,
        };

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}`, 
            connectionOptions
        );

        console.log(`✅ MongoDB Connected: ${connectionInstance.connection.host}`);
        
        // ✅ DB Events listener (Server jaagne par logs dikhengi)
        mongoose.connection.on('connected', () => console.log('📂 MongoDB event connected'));
        mongoose.connection.on('error', (err) => console.error('❌ MongoDB event error:', err));
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); 
    }
};

export default ConnectDB