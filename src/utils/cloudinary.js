import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_USERNAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on the Cloudinary", response, response.url);
    fs.unlinkSync(localPath);
    return response.url;
  } catch (err) {
    fs.unlinkSync(localPath);
  }
};
const uploadVideoOnCloudinary = async (localPath)=>{
  try{
    if(!localPath) return null;
    const response = await cloudinary.uploader.upload(localPath,{
      resource_type:"video"
    })
    console.log("response for video upload",response,response.url);
    console.log("File is uploaded on the Cloudinary",response,response.url);
    // todo for video
    // if the video is uploaded successfully then delete the video from the local path
    fs.unlinkSync(localPath)
    return response
  }
  catch(err){
    fs.unlinkSync(localPath)
  }
}

export { uploadOnCloudinary,uploadVideoOnCloudinary }
