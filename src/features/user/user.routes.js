import express from 'express';
import { UserController } from './user.controller.js';
import { jwtAuth } from '../../../middlewares/jwtAuth.middleware.js';

const userRouter=express.Router();
const userController=new UserController();
// User Authentication functionality 
userRouter.post('/signup',(req,res,next)=>userController.registerUser(req,res,next));
userRouter.post('/signin',(req,res,next)=>userController.loginUser(req,res,next));
userRouter.get('/logout',(req,res,next)=>userController.logoutUser(req,res,next));
// userRouter.get('/logout-all-devices',(req,res,next)=>userController.logoutAllDevices(req,res,next));

//User Profile functionality
userRouter.get('/get-details/:userId',jwtAuth,(req,res,next)=>userController.getUserDetails(req,res,next));
userRouter.get('/get-all-details',jwtAuth,(req,res,next)=>userController.getAllUserDetails(req,res,next));
userRouter.put('/update-details/:userId',jwtAuth,(req,res,next)=>userController.updateUserDetails(req,res,next));


export default userRouter;