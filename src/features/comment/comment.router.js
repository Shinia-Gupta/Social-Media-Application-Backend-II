import express from 'express';
import { CommentController } from './comment.controller.js';

const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.get('/:postId', (req, res, next) => commentController.getAllComments(req, res, next));
commentRouter.post('/:postId', (req, res, next) => commentController.createComment(req, res, next));
commentRouter.delete('/:commentId', (req, res, next) => commentController.deleteComment(req, res, next));
commentRouter.put('/:commentId', (req, res, next) => commentController.updateComment(req, res, next));

export default commentRouter;