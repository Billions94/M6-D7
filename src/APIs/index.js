import express from 'express'
import createHttpError from 'http-errors'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import BlogModel from './schema.js'
import multer from 'multer'
import q2m from 'query-to-mongo'

const blogPostRouter = express.Router()


const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS, 
    params: {
      folder: "alex-blogs-Mongo",
    },
  })

// CREATE NEW POST  
blogPostRouter.post('/', async (req, res, next) => {
    try {
        
        const newPost = new BlogModel(req.body)

        const {_id} = await newPost.save()
        res.status(201).send({_id})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// ADD COVER TO EXISTING POST BY ID
blogPostRouter.put('/:blogId', multer({ storage: cloudinaryStorage}).single('cover'), async (req, res, next) => {
    try {
        const id = req.params.blogId
        const cover = req.file.path
        const updatedPost = await BlogModel.findByIdAndUpdate(id, {$set: {cover: cover }}, { new: true })

        if(updatedPost){
            res.status(203).send(updatedPost)
        } else {
            next(createHttpError(404, `post with this id ${id} not found`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// GET ALL BLOGPOSTS WITH PAGINATION 
blogPostRouter.get('/', async (req, res, next) => {
    try {
        const mongoQuery = q2m(req.query)
        console.log(mongoQuery)

        const total = await BlogModel.countDocuments(mongoQuery.criteria)
        const post = await BlogModel.find(mongoQuery.criteria)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)

        res.send({ links: mongoQuery.links('/posts', total),
         pageTotal: Math.ceil(total / mongoQuery.options.limit),
        total, post })

    } catch (error) {
        console.log(error)
        next(error)
    }
})

// GET SPECIFY BLOGPOST BY ID
blogPostRouter.get('/:blogId', async (req, res, next) => {
    try {
        const id = req.params.blogId

        const post = await BlogModel.findById(id)

        if(post){
            res.send(post)
        } else {
            next(createHttpError(404, `post with this id ${id} not found`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// UPDATE SPECIFY POST BY ID
blogPostRouter.put('/:blogId', async (req, res, next) => {
    try {
        const id = req.params.blogId

        const updatedPost = await BlogModel.findByIdAndUpdate(id, req.body, { new: true })

        if(updatedPost){
            res.status(203).send(updatedPost)
        } else {
            next(createHttpError(404, `post with this id ${id} not found`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// DELETE SPECIFY POST BY ID
blogPostRouter.delete('/:blogId', async (req, res, next) => {
    try {
        const id = req.params.blogId

        const deletedPost = await BlogModel.findByIdAndDelete(id)

        if(deletedPost){
            res.status(204).send()
        } else {
            next(createHttpError(404, `post with this id ${id} not found`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default blogPostRouter