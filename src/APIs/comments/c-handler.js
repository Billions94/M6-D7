import BlogModel from "../blogPost/schema.js";
import CommentModel from "../comments/schema.js";
import createHttpError from "http-errors";

// POST A NEW COMMENT
const createComment = async (req, res, next) => {
  try {
    const comment = await CommentModel(req.body);
    console.log(comment);

    if (comment) {
      const comments = { ...comment.toObject() };
      console.log(comments);
      const updatedBlog = await BlogModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { comments: comments } },
        { new: true } // opts
      );
      if (updatedBlog) {
        res.status(201).send(updatedBlog);
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.blogId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
};

// GET ALL COMMENTS FOR A SPECIFY POST
const getAll = async (req, res, next) => {
  try {
    const posts = await BlogModel.findById(req.params.blogId);

    if (posts) {
      res.send(posts.comments);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
};

// GET SPECIFIC COMMENT BY ID
const getById = async (req, res, next) => {
  try {
    const blog = await BlogModel.findById(req.params.blogId);
    if (blog) {
      const comments = blog.comments.find((c) => c._id.toString() === req.params.commentId)
      if (comments) {
        res.send(comments);
      } else {
        next(createHttpError(404, `Comment with id ${req.params.blogId} not found!`))
      }
    } else {
      next(createHttpError(404, `Post with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE A COMMENT
const updateComment = async (req, res, next) => {
  try {
    const blog = await BlogModel.findById(req.params.blogId);

    if (blog) {
     const  index = blog.comments.findIndex((b) => b._id.toString() === req.params.commentId);

      if (index !== -1) {
        blog.comments[index] = {
          ...blog.comments[index].toObject(),
          ...req.body,
        };
        await blog.save();
        res.status(203).send(blog);
      } else {
        next(
          createHttpError(404, `Post with id ${req.params.blogId} not found!`)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

// DELETE A COMMENT
const deleteComment = async (req, res, next) => {
  try {
    const modifiedBlog = await BlogModel.findByIdAndUpdate(
      req.params.blogId, // WHO
      { $pull: { comments: { _id: req.params.commentId } } }, // how we want to modify the comments
      { new: true } // opts
    );
    if (modifiedBlog) {
      res.send({modifiedBlog});
    } else {
      next(
        createHttpError(404, `Comment with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
};

const commentsHandler = {
  createComment,
  getAll,
  getById,
  updateComment,
  deleteComment,
};

export default commentsHandler;
