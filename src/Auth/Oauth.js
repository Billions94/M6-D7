import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import  AuthorModel  from "../APIs/authors/schema.js"
import { tokenGenerator } from "./authTools.js"

const { CLIENT_ID, CLIENT_SECRET, API_URL } = process.env

const googleCloudStrategy = new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: `${API_URL}/authors/googleRedirect`
},
async (accessToken, refreshToken, profile, passportNext) => {
    try {
        
        const author = await AuthorModel.findOne({ googleId: profile.id })

        if(author) {
            const tokens = await tokenGenerator(author)
            passportNext(null, { tokens })
        } else {
            const newAuthor = new AuthorModel({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email:  profile.emails[0].value,
                googleId: profile.id
            })

            const savedAuthor = await newAuthor.save()
            const tokens = await tokenGenerator(savedAuthor)
            passportNext(null, { tokens })
        }
    } catch (error) {
        passportNext(error)
    }
})

passport.serializeUser(function (data, passportNext) {
    passportNext(null, data)
})

export default googleCloudStrategy