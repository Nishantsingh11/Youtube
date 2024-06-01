import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user
    //TODO: create playlist
    // get the name,description from the request body
    // get the videos from the req.body
    // create a new playlist
    // return the playlist
    if(!name||!description){
        throw new ApiError(400,"all fields are required")
    }
    const playlist =await Playlist.create(
        {
            name,
            description,
            owner:userId._id

        }
    )
    if(!playlist){
        throw new ApiError(500,"Unable to make playlist try later")
    }

    res.status(200).json(new ApiResponse(201,playlist,"Playlist created successfully"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    // get the user id from the request object
    // get all the playlists of the userr using owner field
    // return the playlists
    const playlist = await Playlist.find({ower:userId})
    if(!playlist){
        throw new ApiError(404,"Playlist not Found")
    }
    res.status(200).json(new ApiResponse(200,playlist,"Playlist found"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    // get the id from params
    // get the playlist by id
    // return the playlist
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist not Found")
    }
    res.status(200).json(new ApiResponse(200,playlist,"Playlist found"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video to playlist
    // get the playlist id and video id from the params
    // check if the video exists in the playlist
    // if it exists, return an error
    // else add the video to the playlist by pushing the video id to the videos array
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist not Found")
    
    }
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400,"Video already in the playlist")
    }
    playlist.videos.push(videoId)

    await playlist.save()
    res.status(200).json(new ApiResponse(200,playlist,"Video added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    // get the playlist id and video id from the params
    // check if the video exists in the playlist
    // if it exists, remove the video from the playlist
    // else return an error
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist not Found")
    }
    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400,"Video not in the playlist")
    }
    // playlist.videos = playlist.videos.filter(v=>v!==videoId)
    // console.log("playlist",playlist);
    // await playlist.save()
    playlist.videos = playlist.videos.filter(v => !v.equals(new mongoose.Types.ObjectId(videoId)));
    await playlist.save();
    res.status(200).json(new ApiResponse(200,playlist,"Video removed from playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    // get the playlist id from the params
    // delete the playlist
    // return the playlist
    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist not Found")
    }
    res.status(200).json(new ApiResponse(200,playlist,"Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    // get the playlist id from the params
    // get the name and description from the request body
    // update the playlist
    // return the playlist
    // if the playlist does not exist, return an error
    // if the user is not the owner of the playlist, return an error
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist not Found")
    }
    if(playlist.owner!==req.user._id){
        throw new ApiError(403,"You are not the owner of the playlist")
    }
    playlist.name = name
    playlist.description = description
    await playlist.save()
    res.status(200).json(new ApiResponse(200,playlist,"Playlist updated"))
    

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}