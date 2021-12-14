import BlogModel from "./schema.js";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import mongoose from "mongoose";
import AuthorModel from "../authors/schema.js"

// CREATE BLOG POST
const createBlogPost = async (req, res, next) => {
  try {

    const authorId = req.params.id
    const author = await AuthorModel.findById(authorId)

    const newPost = new BlogModel(req.body);
    newPost.author = author._id
    const { _id } = await newPost.save();
    if(newPost) {
      res.status(201).send({ _id });
    } else {
      next(createHttpError(404, `Unable to create Post`))
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ADD COVER PHOTO TO POST
const addCover = async (req, res, next) => {
  try {
    const id = req.params.blogId;
    const cover = req.file.path;
    const updatedPost = await BlogModel.findByIdAndUpdate(
      id,
      { $set: { cover: cover } },
      { new: true }
    );

    if (updatedPost) {
      res.status(203).send(updatedPost);
    } else {
      next(createHttpError(404, `post with this id ${id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const postLike = async (req, res, next) => {
    try {
        const id = req.params.blogId;
        console.log(id)
        const post = await BlogModel.findById(id);
        if (post) {
          const liked = await BlogModel.findOne({
            _id: id,
            likes: new mongoose.Types.ObjectId(req.body.authorId),
          });
          console.log(liked)
    
          if (!liked) {
            await BlogModel.findByIdAndUpdate(id, {
              $push: { likes: req.body.authorId }
            }, {new: true});
          } else {
            await BlogModel.findByIdAndUpdate(id, {
              $pull: { likes: req.body.authorId },
            });
          }
        } else {
          next(createHttpError(404, `post with this id ${id} not found`));
        }
          await post.save()
        res.status(201).send(post);
      } catch (error) {
        next(error);
      }
}

// GET ALL BLOGPOSTS WITH PAGINATION
const getAll = async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    console.log(mongoQuery);

    const total = await BlogModel.countDocuments(mongoQuery.criteria);
    const post = await BlogModel.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({ path: "author", select: "firstName lastName" })
      .populate({ path: "likes", select: "firstName lastName" });

    res.send({
      links: mongoQuery.links("/posts", total),
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      total,
      post,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get all blogPosts from a specify Author
const getPostOfAuthor = async (req, res, next) => {
  try {
      const id = req.author._id.toString()
      const posts = await BlogModel.find({author: id})
      if(posts.length > 0) {
        res.status(200).send({ success: true, data: posts });
      } else {
        res.status(404).send({ success: true, message: "No articles yet" });
      }
  } catch (error) {
      next(error)
  }
}

// GET SPECIFY BLOGPOST BY ID
const getById = async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const post = await BlogModel.findById(id).populate({
      path: "author",
      select: "firstName lastName",
    });
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `post with this id ${id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// UPDATE SPECIFY POST BY ID
const updateBlogPost = async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const updatedPost = await BlogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedPost) {
      res.status(203).send(updatedPost);
    } else {
      next(createHttpError(404, `post with this id ${id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// DELETE SPECIFY POST BY ID
const deleteBlogPost = async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const deletedPost = await BlogModel.findByIdAndDelete(id);

    if (deletedPost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `post with this id ${id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const blogPostHandler = {
  createBlogPost,
  addCover,
  postLike,
  getAll,
  getPostOfAuthor,
  getById,
  updateBlogPost,
  deleteBlogPost,
};

export default blogPostHandler;
