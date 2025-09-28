import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";

const submitFeedback = asyncHandler(async (req, res) => {
    const { subject, category, message } = req.body;

    if ([subject, category, message].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const feedback = await Feedback.create({
        subject,
        category,
        message,
        submittedBy: req.user._id, // Comes from verifyJWT middleware
        submittedByType: req.user.constructor.modelName // 'User', 'Teacher', or 'Admin'
    });

    if (!feedback) {
        throw new ApiError(500, "Something went wrong while submitting feedback");
    }

    return res.status(201).json(
        new ApiResponse(201, feedback, "Feedback submitted successfully")
    );
});

export { submitFeedback };