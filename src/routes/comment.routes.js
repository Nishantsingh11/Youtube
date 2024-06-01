import {getVideoComments,addComment,deleteComment,updateComment} from "../controllers/comment.controller.js"
import { Router } from "express"
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router()
router.route('/:videoId').get(getVideoComments)
router.route('/addcomment/:videoId').post(verifyJWT,addComment)
router.route('/deletecomment/:commentId').delete(verifyJWT,deleteComment)
router.route('/updatecomment/:commentId').patch(verifyJWT,updateComment)


export default router