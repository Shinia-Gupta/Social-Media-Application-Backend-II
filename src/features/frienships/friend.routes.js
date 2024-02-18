import express from 'express';
import { FriendController } from './friend.controller.js';

const friendRouter=express.Router();
const friendController=new FriendController();
friendRouter.get('/get-friends/:userId',(req,res,next)=>friendController.getFriends(req,res,next));
friendRouter.get('/get-pending-requests',(req,res,next)=>friendController.getPendingRequests(req,res,next));
friendRouter.post('/toggle-friendship/:friendId',(req,res,next)=>friendController.toggleFriendship(req,res,next));
friendRouter.post('/response-to-request/:friendId',(req,res,next)=>friendController.respondRequest(req,res,next));

export default friendRouter;