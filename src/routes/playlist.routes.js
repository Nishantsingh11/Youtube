import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getUserPlaylists,
    getPlaylistById

} from "../controllers/playlist.controller.js"
import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/get-playlist").get(verifyJWT,getUserPlaylists)
router.route("/create-playlist").post(verifyJWT,createPlaylist)
router.route("/:playlistId").get(verifyJWT,getPlaylistById)
router.route("/:playlistId/add-video/:videoId").put(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/remove-video/:videoId").patch(verifyJWT,removeVideoFromPlaylist)
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId").patch(verifyJWT,updatePlaylist)



export default router