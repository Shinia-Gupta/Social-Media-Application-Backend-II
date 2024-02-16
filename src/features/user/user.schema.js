import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    name:{type:String,required:true,minLength:[3,'Name cannot be less than 3 characters long']},
    email:{type:String,required:true,unique:true,match:[/.+\@.+\..+/,'Please enter a valid email']},
    password:{type:String,required:true},
    gender:{type:String,enum:['Male','Female'],required:true}
    // tokens:[{type:String}]
});