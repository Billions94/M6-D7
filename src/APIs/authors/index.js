import express from 'express'
import authorsHandler from './a-handler.js'
import { tokenAuth } from '../../Auth/tokenAuth.js'
import { adminOnlyMiddleware } from '../../Auth/admin.js'
import passport from 'passport'

const { FE_URL } = process.env

const authorsRouter = express.Router()


authorsRouter.post('/register', authorsHandler.createAuthors)

authorsRouter.post('/login', authorsHandler.authorLogin)

authorsRouter.post('/refreshToken', authorsHandler.refreshToken)

authorsRouter.post('/logout', authorsHandler.logout)

authorsRouter.get('/', tokenAuth, authorsHandler.getAll)

authorsRouter.get('/googleLogin', passport.authenticate('google', { scope: ["profile", "email"] }))

authorsRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
    // This endpoint URL needs to match EXACTLY to the one configured on google.cloud dashboard
    try {
      // Thanks to passport.serialize we are going to receive the tokens in the request
      console.log("TOKENS: ", req.authors.tokens)
  
      res.redirect(`${FE_URL}?accessToken=${req.authors.tokens.accessToken}&refreshToken=${req.authors.tokens.refreshToken}`)
    } catch (error) {
      next(error)
    }
})

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