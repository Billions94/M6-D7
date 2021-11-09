import express from 'express';
import createHttpError from 'http-errors';

import BlogModel from './schema.js'

const blogPostRouter = express.Router()

blogPostRouter.post('/', async (req, res, next) => {
    try {
        const newPost = new BlogModel(req.body)

        const {_id} = await newPost.save()
        res.status(201).send({_id})
    } catch (error) {
        console.log(error);
    }
})

blogPostRouter.get('/', async (req, res, next) => {
    try {
        const post = await BlogModel.find()
        res.send(post)
    } catch (error) {
        console.log(error)
    }
})

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
    }
})

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
    }
})

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
    }
})

export default blogPostRouter