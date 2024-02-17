import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';
import { jwtAuth } from './middlewares/jwtAuth.middleware.js';
import { ApplicationError } from './error_handler/customErrorHandler.js';
import userRouter from './src/features/user/user.routes.js';
import postRouter from './src/features/post/post.routes.js';
import commentRouter from './src/features/comment/comment.router.js';
import likeRouter from './src/features/likes/like.routes.js';

const app=express();

app.use(bodyParser.json());
app.use(cookieParser());
// app.use('/api-docs',swagger.serve,swagger.setup(apiDocs));  //create and import it then remove this comment

app.use('/api/users',userRouter);

app.use('/api/posts',jwtAuth,postRouter);
app.use('/api/comments',jwtAuth,commentRouter);
app.use('/api/likes',jwtAuth,likeRouter);

app.use((err,req,res,next)=>
{
    if(err instanceof mongoose.Error.ValidationError){
     return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
      return res.status(err.statusCode).send(err.message);
    }

    console.log(err);
    res.status(500).send("Something Went Wrong! Please try again later");
})

app.use((req,res)=>{
    res.status(404).send('API not found!Please check our documentation for more information at http://localhost:8000/api-docs ');
})
export default app;