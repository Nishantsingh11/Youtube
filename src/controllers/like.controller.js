import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    console.log("videoId",videoId);
//  find if the user has already liked the video
// if yes, remove the like
// if no, add the like
// return the updated video
const userId = req.user
const likes = await Like.find({
    video: videoId,
    likedBy: userId._id
})
if(likes.length){
    // remove the likeby and video from the like

    if (likes.length) {
        await Like.deleteMany({
            video: videoId,
            likedBy: userId
        });
        return res.status(200).json(new ApiResponse(200, {}, "Like removed successfully"));
    }
    // errror like.remove is not a function
    return res.status(200).json(new ApiResponse(200 , {}, "Like removed successfully"))
}
const newLike = new Like({
    video: videoId,
    likedBy: userId._id
})
await newLike.save()
res.status(201).json(new ApiResponse(201,newLike, "Like added successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
// find if the user has already liked the comment
// if yes, remove the like
// if no, add the like
// return the updated comment
const {userId}  = req.user
const like = await Like.findOne({
    comment: commentId,
    likedBy: userId
})
if(like){
    await like.remove()
    return res.status(200).json(new ApiResponse(200,{}, "Like removed successfully"))
}
const newLike = new Like({
    comment: commentId,
    likedBy: userId

})
await newLike.save()
res.status(201).json(new ApiResponse(201,newLike, "Like added successfully"))
})



const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {userId} = req.user
    const likes = await Like.find({
        likedBy: userId
    }).populate("video")
    const videos = likes.map(like => like.video)
    res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched successfully"))
    })

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}