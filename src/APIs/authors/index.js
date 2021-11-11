import express from 'express'
import authorsHandler from './a-handler.js'

const authorsRouter = express.Router()

authorsRouter.post('/', authorsHandler.createAuthors)

authorsRouter.get('/', authorsHandler.getAll)

authorsRouter.route('/:authorId') 
.get(authorsHandler.getById)
.put(authorsHandler.updateAuthor)
.delete(authorsHandler.deleteAuthor)



export default authorsRouter