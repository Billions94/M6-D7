import AuthorModel from './schema.js'
import createHttpError from "http-errors";
import BlogModel from '../blogPost/schema.js'
import { tokenGenerator } from '../../Auth/authTools.js'
// CREATE NEW AUTHORS
const createAuthors = async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        const {_id} = await newAuthor.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
}

// Author login
const authorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const author = await AuthorModel.verifyCredentials(email, password)

        if(author) {
            const token = await tokenGenerator(author)
            res.send({ token })
        } else {
            next(createHttpError(401, "Credentials not ok!"))
        }
    } catch (error) {
        next(error)
    }
}

// GET ALL AUTHORS

const getAll = async (req, res, next) => {
    try {
        const authors = await AuthorModel.find()
        res.send(authors)
    } catch (error) {
        next(error)
    }
}


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


const getUserAuthor = async (req, res, next) => {
    try {
        const id = req.author._id.toString()

        const author = await AuthorModel.findById(id)

        if(author){
            res.send(author)
        } else {
            next(createHttpError(404, `Author with this id ${id} not found`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// GET AUTHOR BY ID 
const getById = async (req, res, next) => {
    try {
        const id = req.params.authorId

        const author = await AuthorModel.findById(id)

        if(author){
            res.send(author)
        } else {
            next(createHttpError(404, `Author with this id ${id} not found`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// UPDATE AUTHOR BY ID
const updateAuthor = async (req, res, next) => {
    try {

        const id = req.author._id.toString()
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(id, req.body, {new: true})

        if(updatedAuthor) {
            res.status(203).send(updatedAuthor)
        } else {
            next(createHttpError(404, `Author with this id ${id} not found`))
        }
    } catch (error) {
        next(error)
    }
}

// DELETE AUTHOR BY ID
const deleteAuthor = async (req, res, next) => {
    try {
        const id = req.author._id.toString()
        const deletedAuthor = await AuthorModel.findByIdAndDelete(id)

        if(deletedAuthor) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Author with this id ${id} not found`))
        }
    } catch (error) {
        next(error)
    }
}



const authorsHandler = {
    authorLogin,
    createAuthors,
    getAll,
    getPostOfAuthor,
    getById,
    updateAuthor,
    getUserAuthor,
    deleteAuthor
}

export default authorsHandler