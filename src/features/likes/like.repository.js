import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ApplicationError } from "../../error_handler/customErrorHandler.js";
import { ObjectId } from "mongodb";
import { commentModel } from "../comment/comment.repository.js";
import { postModel } from "../post/post.repository.js";
const likeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getAll(id, model) {
    try {
      const likes = await likeModel
        .find({ likeable: new ObjectId(id), on_model: model })
        .populate("user", "name")
        .populate({ path: "likeable", on_model: model });
      if (likes.length != 0) {
        return { success: true, res: likes };
      } else {
        return {
          success: true,
          res: "No likes yet! Be the first to like",
        };
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }

  async toggleLikes(id, userId, model) {
    //check if like already exists
    console.log(typeof model);
    if(model!=='Comment' && model!=='Post'){
        return {success:false,error:{statusCode:400,message:'Please input a valid model-Comment or Post'}}
    }
    try {
      const likeExisting = await likeModel.findOne({
        likeable: new ObjectId(id),
        user: new ObjectId(userId),
        on_model: model,
      });
      
      //if it exists, remove it
      if (likeExisting) {
      if(model=='Post'){
        const postId = likeExisting.likeable;

const postToDeleteLike=await postModel.findByIdAndUpdate(
    { _id: postId },
    { $pull: { likes: likeExisting._id } }
  );
  // console.log('post to delete like-',postToDeleteLike);

      }else{
   
        const commentId = likeExisting.likeable;

const commentToDeleteLike=await commentModel.findByIdAndUpdate(
    { _id: commentId },
    { $pull: { likes: likeExisting._id } }
  );
  // console.log(commentToDeleteLike);
      }
        const likeToDelete = await likeModel.deleteOne({
          _id: likeExisting._id,
        });
        return { success: true, res: likeToDelete };
      }

      //otherwise add it
      else {
        const newLike = new likeModel({
          user: new ObjectId(userId),
          likeable: new ObjectId(id),
          on_model: model,
        });
        const savedLike = await newLike.save();
        if(model=='Post'){
            
            const postId = newLike.likeable;
    const postToAddLike=await postModel.findById(postId);
    postToAddLike.likes.push( newLike._id)
        await postToAddLike.save();
    
      // console.log(postToAddLike);
    
          }else{
       
            const commentId = newLike.likeable;
    const commToAddLike=await commentModel.findById(commentId);

   commToAddLike.likes.push(newLike._id)
   await commToAddLike.save();
      console.log(commToAddLike);
          }

        return { success: true, res: savedLike };
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }
}
