import mongoose from "mongoose";
import { friendSchema } from "./friend.schema.js";
import { userModel } from "../user/user.repository.js";
import { ApplicationError } from "../../error_handler/customErrorHandler.js";
import { ObjectId } from "mongodb";
// import { new ObjectId} from "mongoose";
const friendModel = mongoose.model("Friend", friendSchema);
// const new ObjectId=mongoose.Types.new ObjectId
export class FriendRepository {
  async getAll(userId) {
    try {
      const user = await userModel.findById(userId);
      if (user) {
        if (user.friends.length != 0) {
          return { success: true, res: user.friends };
        } else {
          return {
            success: true,
            res: "No friends for this user yet! Send the first friend request",
          };
        }
      } else {
        return {
          success: false,
          error: { statusCode: 404, message: "No such user exists" },
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

  async getPendingRequests(userId) {
    try {
      const user = await userModel.findById(userId);
      if (user.pending_requests.length != 0) {
        const pendingReq = user.pending_requests;
        return { success: true, res: pendingReq };
      } else {
        return {
          success: true,
          res: "No pending requests",
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

  async toggleFriendship(userId, friendId) {
    if (userId == friendId) {
      return {
        success: false,
        error: { statusCode: 400, message: "You cannot enter your own id!" },
      };
    }
    try {
      //check valid friendid

      const validFriend = await userModel.findById(friendId);
      if (!validFriend) {
        return {
          success: false,
          error: { statusCode: 404, message: "No such user found!" },
        };
      }

      //find if frienship already exists based on the status as accepted and userid and friendid
      const friendExisting = await friendModel.findOne({
        user: new ObjectId(userId),
        friend: new ObjectId(friendId),
        status: "Accepted",
      });
      console.log("friendExisting-", friendExisting);
      //if friendship exists remove it from friends collection and user friends collection and in friend's friend collection set the status as unfriended
      if (friendExisting) {
        const user = await userModel.findByIdAndUpdate(
          { _id: userId },
          { $pull: { friends: friendExisting._id } }
        );
        const userToUnfriend = await friendModel.findByIdAndUpdate(
          { _id: friendId },
          { $set: { status: "Unfriended" } }
        );
        console.log(
          "current user-",
          user,
          " and unfriended user-",
          userToUnfriend
        );
        await friendModel.deleteOne({ _id: friendExisting._id });
        return { success: true, res: "user unfriended" };
      }

      //if frienship does not exist, add the friendship in the document at pending status and also in friend's friend collection in pending-requests array
      else {
        const user = await userModel.findById(userId);
        const newFriend = new friendModel({
          user: new ObjectId(userId),
          friend: new ObjectId(friendId),
          status: "Pending",
        });
        console.log("user=", user);
        await newFriend.save();
        validFriend.pending_requests.push(userId);
        // user.pending_requests.push(friendId);
        await validFriend.save();
        // await user.save();
        return { success: true, res: "Friend Request sent" };
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end-${error}`
      );
    }
  }

  // async respondRequest(userId, response, tofriendId) {
  //   try {
  //     if (response !== "Accepted" && response !== "Rejected") {
  //       return {
  //         success: false,
  //         error: {
  //           statusCode: 400,
  //           message: "Please input a valid response-Accepted or Rejected",
  //         },
  //       };
  //     }

  //     //find resId in pending_req array
  //     const userRespondingReq = await userModel.findById(userId);
  //     const friendId = userRespondingReq.pending_requests.findIndex(
  //       (resp) => resp._id == tofriendId
  //     );
  //     const friend = await userModel.findById(tofriendId);
  //     //if found
  //     if (friendId != -1) {
  //       //{if response-accept,add resId to friends array of user and also update the other user's friends array, change the status as accepted in friends collection
  //       if (response === "Accepted") {
  //         userRespondingReq.friends.push(tofriendId);
  //         await userRespondingReq.save();
  //         friend.friends.push(userId);
  //         await friend.save();
  //         await userModel.findByIdAndUpdate(
  //           { _id: userRespondingReq._id },
  //           { $pull: { pending_requests: new ObjectId(tofriendId) } }
  //         );
  //         await userModel.findByIdAndUpdate(
  //           { _id: friend._id },
  //           { $pull: { pending_requests: new ObjectId(userId) } }
  //         );

  //         // const friendInColl=await friendModel.findOne({user: new ObjectId(userId),friend: new ObjectId(tofriendId)});
  //         // console.log("friendInColl accepted-", friendInColl);
  //         // friendInColl.status='Accepted';
  //         // await friendInColl.save();
  //         const friendInColl = await friendModel.findOneAndUpdate(
  //           { user: new ObjectId(userId), friend: new ObjectId(tofriendId) },
  //           { $set: { status: 'Accepted' } }
  //         );
  //         console.log("friendInColl accepted-", friendInColl);
  //         return { success: true, res: "Friend Request accepted" };
  //       } else {
  //         //if response-reject, remove resId from both the user's array and from the friends collection}
  //         const friendInColl = await friendModel.findOneAndUpdate(
  //           { user: new ObjectId(userId), friend: new ObjectId(tofriendId) },
  //           { $set: { status: "Rejected" } }
  //         );
  //         console.log("friendInColl Rejected-", friendInColl);
  //         await userModel.findByIdAndUpdate(
  //           { _id: userRespondingReq._id },
  //           { $pull: { pending_requests: new ObjectId(tofriendId) } }
  //         );
  //         await userModel.findByIdAndUpdate(
  //           { _id: friend._id },
  //           { $pull: { pending_requests: new ObjectId(userId) } }
  //         );
  //         // const friendInColl=await friendModel.deleteOne({user: new ObjectId(userId),friend: new ObjectId(tofriendId)});
  //         // console.log("friendInColl Rejected-",friendInColl);

  //         return { success: true, res: "Friend Request Rejected" };
  //       }
  //     } else {
  //       //else not found-bad request message
  //       return {
  //         success: false,
  //         error: { statusCode: 404, message: "Request not found" },
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new ApplicationError(
  //       500,
  //       `Something went wrong on our end-${error}`
  //     );
  //   }
  // }

  async respondRequest(userId, response, tofriendId) {
    try {
      if (response !== "Accepted" && response !== "Rejected") {
        return {
          success: false,
          error: {
            statusCode: 400,
            message: "Please input a valid response - Accepted or Rejected",
          },
        };
      }

      const userRespondingReq = await userModel.findById(userId);
      const friendId = userRespondingReq.pending_requests.findIndex(
        (resp) => resp._id == tofriendId
      );
      const friend = await userModel.findById(tofriendId);

      if (friendId !== -1) {
        if (response === "Accepted") {
          userRespondingReq.friends.push(tofriendId);
          await userRespondingReq.save();

          friend.friends.push(userId);
          await friend.save();

          // Create a new entry in the friends collection with status "Accepted"
          // await friendModel.create({
          //   user: new ObjectId(userId),
          //   friend: new ObjectId(tofriendId),
          //   status: "Accepted",
          // });

          // // Remove the pending status collection from the friends collection
          // await friendModel.deleteMany({
          //   $or: [
          //     {
          //       user: new ObjectId(userId),
          //       friend: new ObjectId(tofriendId),
          //       status: "Pending",
          //     },
          //     {
          //       user: new ObjectId(tofriendId),
          //       friend: new ObjectId(userId),
          //       status: "Pending",
          //     },
          //   ],
          // });

          await userModel.findByIdAndUpdate(
            { _id: userRespondingReq._id },
            { $pull: { pending_requests: new ObjectId(tofriendId) } }
          );
          await userModel.findByIdAndUpdate(
            { _id: friend._id },
            { $pull: { pending_requests: new ObjectId(userId) } }
          );
          await friendModel.findOneAndUpdate(
            {
              $or: [
                {
                  user: new ObjectId(userId),
                  friend: new ObjectId(tofriendId),
                },
                {
                  user: new ObjectId(tofriendId),
                  friend: new ObjectId(userId),
                },
              ],
              status: "Pending",
            },
            { $set: { status: "Accepted" } },
            { upsert: true, new: true }
          );
          return { success: true, res: "Friend Request accepted" };
        } else {
          // If response is "Rejected", update the status in friends collection and remove from pending_requests
          await friendModel.findOneAndUpdate(
            { user: new ObjectId(userId), friend: new ObjectId(tofriendId) },
            { $set: { status: "Rejected" } },
            { upsert: true, new: true }
          );

          await userModel.findByIdAndUpdate(
            { _id: userRespondingReq._id },
            { $pull: { pending_requests: new ObjectId(tofriendId) } }
          );
          await userModel.findByIdAndUpdate(
            { _id: friend._id },
            { $pull: { pending_requests: new ObjectId(userId) } }
          );

          return { success: true, res: "Friend Request Rejected" };
        }
      } else {
        return {
          success: false,
          error: { statusCode: 404, message: "Request not found" },
        };
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        500,
        `Something went wrong on our end - ${error}`
      );
    }
  }
}
