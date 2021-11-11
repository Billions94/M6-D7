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



const authorsHandler = {
    createAuthors,
    getAll,
}

export default authorsHandler