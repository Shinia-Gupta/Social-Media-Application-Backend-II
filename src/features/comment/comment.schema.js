import mongoose from "mongoose";

export const commentSchema=new mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    comment:
        {
            type:String,
            required:[true,'Comment is required']
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Like'
              }
        ]
    
});