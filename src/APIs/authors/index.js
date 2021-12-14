import express from 'express'
import authorsHandler from './a-handler.js'
import { basicAuthentication } from '../../Auth/basic.js'
import { adminOnlyMiddleware } from '../../Auth/admin.js'

const authorsRouter = express.Router()

authorsRouter.post('/', authorsHandler.createAuthors)

authorsRouter.get('/', basicAuthentication, authorsHandler.getAll)

authorsRouter.route('/me') 
.get(basicAuthentication, authorsHandler.getById)
.put(basicAuthentication, authorsHandler.updateAuthor)
.delete(basicAuthentication, authorsHandler.deleteAuthor)

authorsRouter.route('/:authorId') 
.get(authorsHandler.getById)
.put(authorsHandler.updateAuthor)
.delete(authorsHandler.deleteAuthor)



export default authorsRouter