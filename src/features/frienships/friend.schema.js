import mongoose from "mongoose";


export const friendSchema=new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    friend:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String }

})
// enum: ["Pending", "Accepted", "Rejected","Unfriended"]       //removed enum, as enums cant be updated