import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import commentsHandler from "../comments/c-handler.js";
import blogPostHandler from "./b-handler.js";
import { basicAuthentication } from '../../Auth/basic.js'
import { adminOnlyMiddleware } from '../../Auth/admin.js'

const blogPostRouter = express.Router();


//*********************************** BLOG POST CRUD SECTION ********************************//

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, // CREDENTIALS,
  params: {
    folder: "alex-blogs-Mongo",
  },
});

// CREATE NEW POST
blogPostRouter.post("/", blogPostHandler.createBlogPost)

// ADD COVER TO EXISTING POST BY ID
blogPostRouter.put(
  "/:blogId/upload",
  multer({ storage: cloudinaryStorage }).single("cover"),
  blogPostHandler.addCover
);

// GET ALL BLOGPOSTS WITH PAGINATION
blogPostRouter.get("/", blogPostHandler.getAll);

blogPostRouter.get("/me", basicAuthentication, blogPostHandler.getPostOfAuthor);

// GET SPECIFY BLOGPOST BY ID
blogPostRouter.get("/:blogId", blogPostHandler.getById);

// UPDATE SPECIFY POST BY ID
blogPostRouter.put("/:blogId", blogPostHandler.updateBlogPost);

// DELETE SPECIFY POST BY ID
blogPostRouter.delete("/:blogId", blogPostHandler.deleteBlogPost);



//*********************************** COMMENTS CRUD SECTION ********************************//

// GET ALL COMMENTS FOR A SPECIFY POST
blogPostRouter.get("/:blogId/comments", commentsHandler.getAll);

// POST A NEW COMMENT
blogPostRouter.post("/:blogId/comments", commentsHandler.createComment);

// GET SPECIFIC COMMENT BY ID
blogPostRouter.get("/:blogId/comments/:commentId", commentsHandler.getById);

// UPDATE A COMMENT
blogPostRouter.put("/:blogId/comments/:commentId", commentsHandler.updateComment);

// DELETE A COMMENT
blogPostRouter.delete("/:blogId/comments/:commentId", commentsHandler.deleteComment);

//*********************************** BLOG POST LIKE SECTION ********************************//

// POST LIKES
blogPostRouter.put("/:blogId/likes", blogPostHandler.postLike);

export default blogPostRouter;
