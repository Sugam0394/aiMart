import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'


const ConnectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`✅ MongoDB Connected : || DB:HOST : ${connectionInstance.connection.host} `)
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
         process.exit(1); 
    }
}

export default ConnectDB