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
    authors: { type: Schema.Types.ObjectId, ref: 'Author'},
    content: { type: String, required: true },
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
