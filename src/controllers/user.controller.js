import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndrefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Something went wrong while genrating the tokens");
  }
};

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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "somthing went wrong while creating th user");
  }
  console.log("for the creadted user", createdUser);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  // first get the username or email and the password,
  // check wheater the username email or password
  // get the userr from the backend
  // if not the user then thowr the error
  // then check for the password from the model and if the user have same password then go ahead and give the accessToken and refreshToken
  // send the data and remove the password
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or email is requred to login ");
  }
  if (!password) {
    throw new ApiError(400, "password is requred to login ");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user don't exist Please Register");
  }

  const isPasswordVaild = await user.isPasswordCorrect(password);
  if (!isPasswordVaild) {
    throw new ApiError(401, "Invaild user credentials");
  }
  const { refreshToken, accessToken } = await generateAccessAndrefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          refreshToken,
          accessToken,
          loggedInUser,
        },
        "User loggin successfully "
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body;
    if (!incomingRefreshToken) {
      throw new ApiError(400, "Unauthorization request");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.ACCESS_TOKEN
    );
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "invaild refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is exprired or invaild");
    }
    const option = {
      httpOnly: true,
      secure: true,
    };
    const { newrefreshToken, accessToken } =
      await generateAccessAndrefreshToken(decodedToken._id);
    res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newrefreshToken, option)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Refresh token refresed"
        )
      );
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while refreshin the new access token"
    );
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
