import { FriendRepository } from "./friend.repository.js";


export class FriendController{
    constructor(){
        this.friendRepo=new FriendRepository();
    }


    async getFriends(req,res,next){
        try {
            const resp = await this.friendRepo.getAll(req.params.userId);
    
            if (resp.success) {
                res.status(200).json({ success: true, friends: resp.res });
            } else {
                // If the repository function returned an error, handle it here
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            // If an unexpected error occurred, handle it here
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async getPendingRequests(req,res,next){
        try {
            const resp = await this.friendRepo.getPendingRequests(req.user._id);
    
            if (resp.success) {
                res.status(200).json({ success: true, pending_requests: resp.res });
            } else {
                // If the repository function returned an error, handle it here
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            // If an unexpected error occurred, handle it here
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async toggleFriendship(req,res,next){
        try {
            const resp = await this.friendRepo.toggleFriendship(req.user._id,req.params.friendId);
    
            if (resp.success) {
                res.status(200).json({ success: true, posts: resp.res });
            } else {
                // If the repository function returned an error, handle it here
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            // If an unexpected error occurred, handle it here
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }

    async respondRequest(req,res,next){
        try {
            const resp = await this.friendRepo.respondRequest(req.user._id,req.query.responded,req.params.friendId);
    console.log(resp);
            if (resp.success) {
                res.status(200).json({ success: true, responded: resp.res });
            } else {
                // If the repository function returned an error, handle it here
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            // If an unexpected error occurred, handle it here
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}