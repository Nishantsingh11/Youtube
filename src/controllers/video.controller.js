import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
const getallVideos = asyncHandler(async (req,res)=>{
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit;
    const sortStage = {};
    sortStage[sortBy] = sortType === 'asc' ? 1 : -1;
   const allVideos = await Video.aggregate([
    {
        $match:{
            isPublished: true,
        }
    },{
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"ownerResult",
            pipeline:[
                {
                    $project:{
                        username:1,
                        avatar:1
                    }
                }
            ]
        }
    },
    {
        $addFields:{
            owner_details:{
                $arrayElemAt:["$ownerResult",0]
            }
        }
    },
    {
        $sort: sortStage
    },
    { $skip: pageSkip },
    { $limit: parsedLimit },
    {
        $project:{
            ownerResult:0
        }
    }
   ])
   res.status(200).json(new ApiResponse(200,allVideos,"All video fetched sussfully"))
})
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    // make a video util to handle video upload
    // get the video from the file
    // upload the video to cloudinary
    // get the video url
    // create the video in the database
    // return the video url
    const videoFilePath = req.files.video[0].path;
    const thumbnailFilePath = req.files.thumbnail[0].path;
        if(!videoFilePath || !thumbnailFilePath){
    return res.status(400).json(new ApiError(400,"Video is required"))
   }
  
   const thumbnailUrl = await uploadOnCloudinary(thumbnailFilePath)
   const videoURl = await uploadVideoOnCloudinary(videoFilePath)
   
    if(!videoURl || !thumbnailUrl){
     return res.status(500).json(new ApiError(500,"Internal server error"))
    }
    const video = new Video({
        title,
        description,
        videoFile:videoURl.url,
        owner:req.user._id,
        duration:videoURl.duration,
        thumbnail:thumbnailUrl
    })
    await video.save()
    res.status(201).json(new ApiResponse(201,video,"Video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        return res.status(404).json(new ApiError(404, "Video not found"))
    }
    res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))

})
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description} = req.body
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findByIdAndUpdate(videoId,{
        title,
        description
    },{
        new:true
    })
    if(!video){
        return res.status(404).json(new ApiError(404,"Video not found"))
    }
    res.status(200).json(new ApiResponse(200,video,"Video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    await Video.findByIdAndDelete(videoId)
    res.status(200).json(new ApiResponse(200,{}, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // TODO: toggle publish status
    const video = await Video.findById(videoId)
    if (!video) {
        return res.status(404).json(new ApiError(404, "Video not found"))
    }
    video.isPublished = !video.isPublished
    await video.save()
    res.status(200).json(new ApiResponse(200, video, "Video publish status updated successfully"))
})

export {getallVideos,publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus}