import express from 'express'
import authorsHandler from './a-handler.js'
import { tokenAuth } from '../../Auth/tokenAuth.js'
import { adminOnlyMiddleware } from '../../Auth/admin.js'


const authorsRouter = express.Router()

authorsRouter.post('/register', authorsHandler.createAuthors)

authorsRouter.post('/login', authorsHandler.authorLogin)

authorsRouter.post('/refreshToken', authorsHandler.refreshToken)

authorsRouter.post('/logout', authorsHandler.logout)

authorsRouter.get('/', tokenAuth, authorsHandler.getAll)

authorsRouter.get('/me/stories', tokenAuth, authorsHandler.getPostOfAuthor)

authorsRouter.route('/me') 
.get(tokenAuth, authorsHandler.getUserAuthor)
.put(tokenAuth, authorsHandler.updateAuthor)
.delete(tokenAuth, authorsHandler.deleteAuthor)

authorsRouter.route('/:authorId') 
.get(tokenAuth, authorsHandler.getById)
.put(tokenAuth, adminOnlyMiddleware, authorsHandler.updateAuthor)
.delete(tokenAuth, adminOnlyMiddleware, authorsHandler.deleteAuthor)



export default authorsRouter