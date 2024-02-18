import mongoose from "mongoose";
import { ObjectId } from "mongodb";

import { commentSchema } from "./comment.schema.js";
import { postModel } from "../post/post.repository.js";
import { ApplicationError } from "../../error_handler/customErrorHandler.js";
export const commentModel = mongoose.model("Comment", commentSchema);
export class CommentRepository {
  async getAll(postId) {
    try {
      const comments = await commentModel.find({ post: new ObjectId(postId) });
      if (comments.length != 0) return { success: true, res: comments };
      else
        return {
          success: true,
          res: "No comments yet! Be the first one to comment!",
        };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }

  async addComment(comment, postId, userId) {
    const postToAddComment = await postModel.findById(postId);
    if (postToAddComment) {
      try {
        const commentAdded = new commentModel({
          post: new ObjectId(postId),
          user: new ObjectId(userId),
          comment: comment,
        });
        //save comment in comments collection
        await commentAdded.save();

        //save comment in comments array of posts collection
        postToAddComment.comments.push(commentAdded._id);
        await postToAddComment.save();
        if (commentAdded) return { success: true, res: commentAdded };
        else
          return {
            success: false,
            error: { statusCode: 404, message: "No such post found!" },
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

  async deleteComment(commentId, userId) {
    try {
      const commentToFindPost = await commentModel.findById(commentId);
      const commentDeleted = await commentModel.deleteOne({
        _id: new ObjectId(commentId),
        user: new ObjectId(userId),
      });
      if(commentToFindPost){
      const postId = commentToFindPost.post;

      // console.log(commentId);
      const delCom = await postModel.findByIdAndUpdate(
        { _id: postId },
        { $pull: { comments: commentId } }
      );
      // console.log(delCom);
      if (commentDeleted.acknowledged) {
        return { success: true, res: commentDeleted };
      } else {
        return {
          success: false,
          error: { statusCode: 404, message: "No such comment found!" },
        };
      }}else{
        return {
          success: false,
          error: { statusCode: 404, message: "No such comment found!" },
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

  async updateComment(commentId, userId, commentUpd) {
    try {
      const commentUpdated = await commentModel.updateOne(
        { _id: new ObjectId(commentId), user: new ObjectId(userId) },
        { $set: { comment: commentUpd } }
      );
      if (commentUpdated.acknowledged) {
        return { success: true, res: commentUpdated };
      } else {
        return {
          success: false,
          error: { statusCode: 404, message: "No such comment found!" },
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
}
