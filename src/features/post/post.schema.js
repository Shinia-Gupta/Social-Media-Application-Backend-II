import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    caption: {
      type: String,
      minLength: [3, "Caption must be at least 3 characters long"],
      required: [true, "Caption is required"],
    },
    imageUrl: String,
    comments:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
      }
    ],
    likes:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
      }
    ]
// imageUrl:{data:Buffer,contentType:}
}
  );
  
