import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "Unauthorization request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invaild Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "somthing went wrong while jwt auth"
    );
  }
});
