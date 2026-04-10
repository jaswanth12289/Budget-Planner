import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("SUCCESSFULLY CONNECTED TO MONGODB!");
        process.exit(0);
    } catch(err) {
        console.error("FAILED", err);
        process.exit(1);
    }
}

testConn();
