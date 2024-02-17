import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { comparePassword, hashPassword } from "../../../utils/hashPassword.js";

export const userModel=mongoose.model('User',userSchema);

export class UserRepository{

    async register(userData){
    try {
        const newUser=new userModel({
            name:userData.name,
            email:userData.email,
            password:userData.password,
            gender:userData.gender
        });
        const savedUser=await newUser.save();
        if(savedUser)
        return {success:true,res:savedUser};
    } catch (error) {
        return {success:false,error:{statusCode:400,message:error}}
    }
}

async login(userData){
    try {
        const {email,password}=userData;
        const user=await userModel.findOne({email});
        if(user){
            //send the password for verification check 
            let passwordVerified=await comparePassword(password,user.password);
            if(passwordVerified){
                return {success:true,res:user};
            }else{
                return {success:false,error:{statusCode:400,message:"Invalid credentials"}}
            }
        }else{
            throw new Error("User not found");
        }
       
    } catch (error) {
        return {success:false, error:{statusCode:400,message:error}}
    }
}
// async updateUserLogins(token,userId){
// try {
//     const user=await userModel.findById(userId);
//     user.tokens.push(token);
//     await user.save();
// return {success:true,res:"Token added successfully"}    
// } catch (error) {
//     console.log(error);
//     return {success:false,res:"Token could not be added"}    

// }
// }
async getById(userId){
    try {
        const user=await userModel.findById(userId);
        if(user){
            return {success:true,res:user}
        }else{
            return {success:false,error:{statusCode:404,message:"This user does not exist!"}}
        }
    } catch (error) {
        return {success:false, error:{statusCode:404,message:error}}
        
    }
}

async getAll(){
    const users= await userModel.find();
    if(users.length!=0){
        return {success:true,res:users}

    }else{
        return {success:false,error:{statusCode:404,message:"Be the first user to post!"}}
    }
}

async updateDetails(userData,userId){
    // const user=await userModel.findById(userId);
try {
//    let password=userData.password;
    const password=await hashPassword(userData.password);
    const updatedUser=await userModel.updateOne({_id:userId},{...userData,password});
    if(updatedUser){
        return {success:true,res:updatedUser};
    }else{
return {success:false,error:{statusCode:400,message:"User information invalid"}}
    }
} catch (error) {
    return {success:false, error:{statusCode:404,message:error}}

}
}

async logoutAll(userId){
try {
     await userModel.findByIdAndUpdate(userId, { $set: { tokens: [] } });
    // console.log(updatedToken);

    return {success:true,res:"logged out of all devices successfully"};
}
 catch (error) {
    console.log(error);
    return {success:false,error:{statusCode:500,message:'could not logout of all devices '}}
    // return {success:false, error:{statusCode:404,message:error}}
}
}
}
