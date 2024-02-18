import { PostRepository } from "./post.repository.js";


export class PostController{
 constructor(){
    this.postRepo=new PostRepository();
 }
    

// Function to handle getting all posts
async getAllPosts(req, res, next) {
    try {
        const resp = await this.postRepo.getAll();

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

// async getAllPosts(req, res, next) {
// const resp=await this.postRepo.getAll();
// if(resp.success){
//     res.status(200).json({success:true,posts:resp.res});
// }else{
//     res.status(200).json({success:false,statusCode:resp.error.statusCode,message:resp.error.message});

// }
// }

// Function to handle getting all posts of logged-in user
// async getAllPostsOfLoggedinUser(req, res, next) {
// const resp=await this.postRepo.getAllByUser(req.user._id);

// if(resp.success){
//     res.status(200).json({success:true,posts:resp.res});
// }else{
//     res.status(200).json({success:false,statusCode:resp.error.statusCode,message:resp.error.message});

// }
// }
async getAllPostsOfLoggedinUser(req, res, next) {
    try {
        const resp = await this.postRepo.getAllByUser(req.user._id);

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

async getOnePost(req,res,next){
    try {
        const resp = await this.postRepo.getAPost(req.params.postId);

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
// Function to handle creating a new post
async createPost(req, res, next) {
    try {

        const resp = await this.postRepo.addPost({ ...req.body,imageUrl:req.file.filename,userId:req.user._id});

        if (resp.success) {
            res.status(201).json({ success: true, post_added: resp.res });
        } else {
            res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        
    }
}

// Function to handle deleting a post
async deletePost(req, res, next) {
try {
    const postId=req.params.postId;
const resp=await this.postRepo.delete(postId,req.user._id);
if(resp.success){
    res.status(200).json({ success: true, post_deleted: resp.res });

}else{
    res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });

} 

} catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });

}
}

// Function to handle updating a post
async updatePost(req, res, next) {
    try {
        const postId = req.params.postId;
        const {caption} = req.body;
        const {imageUrl}=req.file.filename;
        const resp = await this.postRepo.update(postId, req.user._id, {imageUrl,caption});
        
        if (resp.success) {
            res.status(200).json({ success: true, post_updated: resp.res });
        } else {
            res.status(resp.error.statusCode || 500).json({ success: false, message: resp.error.message || "Internal Server Error" });
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }    
}


}