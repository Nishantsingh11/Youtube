import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // todo for the register user
  // 1. get the (username,email,fullName,password,avatar,coverImage)
  // 2. check if the any field is emapty
  // 3. check for the username and email wheather the user is already exist or not
  // 4. send the data to the db to save (on schema useing pre and method the password will be the hased)
  // 5. send the response and remove the password field and refreshtoken from the respose
  // 6. create a refreshtoken and accesstoken and set it as the cookies
  // 7. if any problem is occure then write the catch and send the apierror using utils apiERROR

  const { username, email, fullName, password } = req.body;
  if (
    [username, fullName, email, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are requrid");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "username or email is alredy exist");
  }
  const avatarLocalPath = req.files?.avatar?.[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Image is requred");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar from user ", avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(409, "Avatar is requured ");
  }
  const user = await User.create({
    fullName,
    avatar,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "somthing went wrong while creating th user");
  }
  console.log("for the creadted user", createdUser);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

export { registerUser };
