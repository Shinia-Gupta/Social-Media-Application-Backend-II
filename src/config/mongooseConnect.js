import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
let session;
const url=process.env.DB_URL;
const connectToMongodb=async ()=>{
    try {
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        session=await mongoose.startSession();
        console.log('DB connected via mongoose');
    } catch (error) {
        console.log('Could not connect to the database');
        console.log(error);
    }
}

//not implemented anywhere yet...need a replica set?
export const getSession=()=>{
    return session;
}
export default connectToMongodb;