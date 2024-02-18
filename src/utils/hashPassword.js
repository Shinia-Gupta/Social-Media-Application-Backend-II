import bcrypt from 'bcrypt';
import { ApplicationError } from '../error_handler/customErrorHandler.js';

export const hashPassword=async (password,next)=>{
    try {
        return await bcrypt.hash(password,13);
    } catch (error) {
        console.log(error);
        next(new ApplicationError(400,'encountered error in hashing the password'));
    }
}

export const comparePassword=async(password,hashedPassword,next)=>{
try {
    return await bcrypt.compare(password,hashedPassword);
} catch (error) {
    console.log(error);
    next(new ApplicationError(400,'could not match passwords'));
}
}