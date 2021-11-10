import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      type: Object,
      required: true,
      nested: {
        value: { type: Number },
        unit: { type: Number },
      },
    },
    author: {
      type: Object,
      required: true,
      nested: {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
      },
    },
    content: { type: String, required: true },
    comments: [
      {
        text: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default model("Blog", blogPostSchema);
