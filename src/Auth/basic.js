import createHttpError from "http-errors";
import AuthorModel from "../APIs/authors/schema.js"
import atob from "atob";

export const basicAuthentication = async (req, res, next) => {
    if(!req.headers.authorization) {
        next(createHttpError(401, `Please provide credentials in the Authorization header!`))
    } else {
        const base64credentials = req.headers.authorization.split(' ')[1]
        const credentials = atob(base64credentials)

        const [email, password] = credentials.split(':')

        console.log(' i am the email', email)
        console.log(' i am the password', password)

        const author = await AuthorModel.verifyCredentials(email, password)

        if(author) {
            req.author = author
            next()
        } else {
            next(createHttpError(401, "Credentials are not correct!"))
        }
    }
}