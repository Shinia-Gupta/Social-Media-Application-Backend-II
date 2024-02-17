import express from 'express';
import { LikeController } from './like.controller.js';

const likeRouter=express.Router();
const likeController=new LikeController();

likeRouter.get('/:id',(req,res,next)=>likeController.getLikes(req,res,next));
likeRouter.post('/toggle/:id',(req,res,next)=>likeController.toggleLikes(req,res,next));

export default likeRouter;