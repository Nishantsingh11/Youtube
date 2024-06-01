import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    const comments = await Comment.aggregate([
        // stage 1 : getting all comments of a video using videoId
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            // stage 2 getting user info form users collection
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id:1,
                                username: 1,
                                avatar: "$avatar.url",
                                
                            }
                        }
                    ]
                }
    
            },
            {
                $addFields: {
    
                    owner: {
                        $first : "$owner"
                    } 
                }
            },
            {
                $sort: {
                    "createdAt": -1
                }
            },
    
        ])
    if(!comments){
        throw new ApiError(404, "   No comments found")
    }
return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // get the id of video
    // get the content of the comment
    // get the id of the user
    // create a new comment
    // return the comment

    const {videoId} = req.params
    const {content} = req.body
    const userid = req.user
    console.log("id", userid._id);

    const comment = new Comment({
        content,
        video: videoId,
        owner: userid._id
    })
   await comment.save()
   res.status(200).json(new ApiResponse(200,comment , "Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // get the id of the comment
    // get the content of the comment
    // update the comment
    // return the comment
    const {commentId} = req.params
    const {content} = req.body 
    const comment= await Comment.findByIdAndUpdate(
        commentId,
        {content},
        {new: true}
    )
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    // get the id of the comment
    // delete the comment
    // return the comment
    const {commentId} = req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    return res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }