import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const url=process.env.DB_URL;
const connectToMongodb=async ()=>{
    try {
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('DB connected via mongoose');
    } catch (error) {
        console.log('Could not connect to the database');
        console.log(error);
    }
}

export default connectToMongodb;