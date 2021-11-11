import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BlogPostSchema = new Schema(
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
    author: { type: Schema.Types.ObjectId, ref: 'Author'},
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Author'}],
    comments: [
      {
        userName: { type: String},
        text: { type: String},
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default model("Blog", BlogPostSchema);
