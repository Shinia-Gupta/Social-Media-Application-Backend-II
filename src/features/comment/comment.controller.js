import { CommentRepository } from "./comment.repository.js";


export class CommentController {
    constructor() {
this.commentRepo=new CommentRepository();
    }

    async getAllComments(req, res, next) {
        try {
            const resp = await this.commentRepo.getAll(req.params.postId);
    
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

    async createComment(req, res, next) {
        
        try {
            const resp=await this.commentRepo.addComment(req.body.content,req.params.postId,req.user._id);
            if (resp.success) {
                res.status(201).json({ success: true, post_added: resp.res });
            } else {
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
            
        }
    }

    async deleteComment(req, res, next) {
          
        try {
            const resp=await this.commentRepo.deleteComment(req.params.commentId,req.user._id);
            if (resp.success) {
                res.status(201).json({ success: true, comment_deleted: resp.res });
            } else {
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
            
        }
    }

    async updateComment(req, res, next) {
        try {
            const resp=await this.commentRepo.updateComment(req.params.commentId,req.user._id,req.body.content);
            if (resp.success) {
                res.status(201).json({ success: true, comment_updated: resp.res });
            } else {
                res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
            
        }
    }
}
