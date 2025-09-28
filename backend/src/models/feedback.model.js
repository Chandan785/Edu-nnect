import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Bug Report', 'Suggestion', 'Praise', 'General Inquiry']
    },
    message: {
        type: String,
        required: true
    },
    submittedBy: {
        type: Schema.Types.ObjectId,
        refPath: 'submittedByType', // Dynamic reference
        required: true
    },
    submittedByType: {
        type: String,
        required: true,
        enum: ['User', 'Teacher', 'Admin']
    }
}, { timestamps: true });

export const Feedback = mongoose.model("Feedback", feedbackSchema);