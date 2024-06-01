import mongoose, { Schema } from "mongoose";


const LikeSchema = new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    likedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

},{
    timestamps: true
})
export const Like = mongoose.model("Like", LikeSchema);