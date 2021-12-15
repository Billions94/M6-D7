import createHttpError from "http-errors"
import AuthorModel from "../APIs/authors/schema.js"
import { verifyJWT } from "./authTools.js"

export const tokenAuth = async (req, res, next) => {
    if(!req.headers.authorization) {
        next(createHttpError(404, "Please provide token in Authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")

            const decodedToken = await verifyJWT(token)

            const author = await AuthorModel.findById(decodedToken._id)
            if(author) {
                req.author = author
                next()
            } else {
                next(createHttpError(404, "User not found"))
            }
        } catch (error) {
            next(createHttpError(401, "Token not valid!"))
        }
    }
}