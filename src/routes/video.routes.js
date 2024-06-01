import {getallVideos,publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus} from "../controllers/video.controller.js"

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/").get(getallVideos)

router.route("/upload").post(verifyJWT,upload.fields([
{
    name:"video",
    maxCount:1
},
{
    name:"thumbnail",
    maxCount:1
}
]),publishAVideo)

router.route("/:videoId").get(getVideoById)
router.route("/update/:videoId").patch(verifyJWT,updateVideo)
router.route("/delete/:videoId").delete(verifyJWT,deleteVideo)
router.route("/:videoId/publish").patch(verifyJWT,togglePublishStatus)


export default router;