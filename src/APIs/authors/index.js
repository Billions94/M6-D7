import express from 'express'
import authorsHandler from './a-handler.js'

const authorsRouter = express.Router()

authorsRouter.post('/', authorsHandler.createAuthors)

authorsRouter.get('/', authorsHandler.getAll)

export default authorsRouter