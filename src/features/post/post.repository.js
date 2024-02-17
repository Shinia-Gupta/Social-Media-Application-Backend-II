import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { ApplicationError } from "../../../error_handler/customErrorHandler.js";
import { ObjectId } from "mongodb";
import { userModel } from "../user/user.repository.js";

export const postModel = mongoose.model("Post", postSchema);
export class PostRepository {
  async getAll() {
    try {
      const posts = await postModel.find();
      if (posts.length != 0) return { success: true, res: posts };
      else
        return {
          success: true,
          res: "No posts yet! Be the first one to post!",
        };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }

  async getAllByUser(userId) {
    try {
      const userPosts = await postModel.find({ userId });
      if (userPosts.length != 0) return { success: true, res: userPosts };
      else
        return {
          success: true,
          res: "No posts yet! Create your first new Post!",
        };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }
  async getAPost(postId) {
    try {
      let post = await postModel
        .findById(postId)
        .select("-_id")
        .populate("user", ["name", "email", "-_id"]); //populate everything of the post except the postId using select statement AND populate only the name and email fields of the user and remove the id field of user to be shown.
      
      if (post) return { success: true, res: post };
      else return { success: true, res: "No such post exists!" };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }
  async addPost(data) {
    // console.log(data);
    try {
      // console.log(data);
      // console.log(data.imageUrl.data);
      // console.log(data.imageUrl.contentType);
      const newPost = new postModel({
        user: new ObjectId(data.userId),
        caption: data.caption,
        imageUrl: data.imageUrl,
      });
      await newPost.save();
      //find the user whose post has been created
const user=await userModel.findById(data.userId);
      //push the postid in that user's posts array
      // console.log("userid:",user);
      if(user){
        user.posts.push(newPost._id);
        await user.save();
      }else{
        throw new ApplicationError(404,'User not found in users collection');
      }
      return { success: true, res: newPost };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }

  async delete(postId, userId) {
    try {
      const postToDelete = await postModel.findOne({
        _id: new ObjectId(postId),
        user: new ObjectId(userId),
      });
      // const user=await userModel.findById(data.userId);
console.log('user id-',userId);
console.log('data-',postToDelete);
console.log('post id-',postToDelete._id);
      if (postToDelete.length != 0) {
        const delUserPost=await userModel.findByIdAndUpdate({_id:userId},{$pull:{posts:postToDelete._id}})
        // console.log(delUserPost);
        await postModel.deleteOne({ _id: new ObjectId(postId) });
        return { success: true, res: postToDelete };
      } else
        return {
          success: true,
          res: "No such post exists or you are not the authorized user to delete it!",
        };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }

    async update(postId, userId, postData) {
      try {
        const postToUpdate = await postModel.findOne({
          _id: new ObjectId(postId),
          user: new ObjectId(userId),
        });

        if (postToUpdate!==undefined) {
        const updatedPost=  await postModel.updateOne({ _id: new ObjectId(postId) }, {$set:{caption:postData.caption,imageUrl:postData.imageUrl}});
      //    const savedPost= await updatedPost.save();
      console.log(updatedPost);
          return { success: true, res: updatedPost };
        } else
          return {
            success: true,
            res: "No such post exists or you are not the authorized user to update it!",
          };
      } catch (error) {
        console.log(error);
        throw new ApplicationError(
          500,
          `Something went wrong on our end-${error}`
        );
      }
    }

}
