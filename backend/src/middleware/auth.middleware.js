import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Teacher } from "../models/techer.model.js";
import { Admin } from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken || req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // This new logic finds the user across all three models
    let user = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      user = await Teacher.findById(decodedToken?._id).select("-password -refreshToken");
    }
    
    if (!user) {
      user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    }

    if (!user) {
      throw new ApiError(401, "Invalid access token: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "Invalid access token");
  }
});