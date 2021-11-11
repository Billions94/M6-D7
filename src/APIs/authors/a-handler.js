import AuthorModel from './schema.js'
import createHttpError from "http-errors";

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

// GET ALL AUTHORS

const getAll = async (req, res, next) => {
    try {
        const authors = await AuthorModel.find(req.body)
        res.send(authors)
    } catch (error) {
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
        next(error)
    }
}

// UPDATE AUTHOR BY ID
const updateAuthor = async (req, res, next) => {
    try {

        const id = req.params.authorId
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
        const id = req.params.authorId
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
    createAuthors,
    getAll,
    getById,
    updateAuthor,
    deleteAuthor
}

export default authorsHandler