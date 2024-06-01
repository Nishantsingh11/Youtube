import { getLikedVideos,toggleCommentLike,toggleVideoLike } from "../controllers/like.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/get-liked-videos").get(verifyJWT,getLikedVideos)
router.route("/toggle-video-like/:videoId").post(verifyJWT,toggleVideoLike)
router.route("/toggle-comment-like/:commentId").post(verifyJWT,toggleCommentLike)

export default router