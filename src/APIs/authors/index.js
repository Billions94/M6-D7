import express from 'express'
import authorsHandler from './a-handler.js'
import { basicAuthentication } from '../../Auth/basic.js'
import { adminOnlyMiddleware } from '../../Auth/admin.js'

const authorsRouter = express.Router()

authorsRouter.post('/', authorsHandler.createAuthors)

authorsRouter.get('/', basicAuthentication, authorsHandler.getAll)

authorsRouter.get('/me/stories', basicAuthentication, authorsHandler.getPostOfAuthor)

authorsRouter.route('/me') 
.get(basicAuthentication, authorsHandler.getUserAuthor)
.put(basicAuthentication, authorsHandler.updateAuthor)
.delete(basicAuthentication, authorsHandler.deleteAuthor)

authorsRouter.route('/:authorId') 
.get(basicAuthentication, authorsHandler.getById)
.put(basicAuthentication, adminOnlyMiddleware, authorsHandler.updateAuthor)
.delete(basicAuthentication, adminOnlyMiddleware, authorsHandler.deleteAuthor)



export default authorsRouter