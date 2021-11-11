import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema(
    {
        userName: { type: String, required: true },
        text: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

export default model('Comment', CommentSchema)