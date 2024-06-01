import mongoose from "mongoose";
const PlaylistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    discription:{
        type: String
    },
    videos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
})
export const Playlist = mongoose.model("Playlist", PlaylistSchema);