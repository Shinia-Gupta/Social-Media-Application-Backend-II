import { LikeRepository } from "./like.repository.js";


export class LikeController{
    constructor(){
        this.likeRepo=new LikeRepository();
    }

        
    async getLikes(req,res,next){
        try {
            const resp = await this.likeRepo.getAll(req.params.id,req.query.model);
    
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

    async toggleLikes(req,res,next){
        // console.log(req.params.id,req.user._id,req.query.model);
        const resp=await this.likeRepo.toggleLikes(req.params.id,req.user._id,req.query.model)
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