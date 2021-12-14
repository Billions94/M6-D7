import mongoose from 'mongoose'
import bycrpt from 'bcrypt'

const { Schema, model } = mongoose

const AuthorSchema = new Schema(
    {
        firstName : { type: String, required: true },
        lastName : { type: String, required: true },
        email : { type: String, required: true, unique: true },
        password : { type: String, required: true },
        role: { type: String, default: "User", enum: ["User", "Admin"] },

    },
    {
        timestamps: true
    }
)

AuthorSchema.pre('save', async function () {
    const newAuthor = this
    const plainPW = newAuthor.password

    if(newAuthor.isModified('password')) {
        const hash = await bycrpt.hash(plainPW, 10)
        newAuthor.password = hash
    }
    next()
})


AuthorSchema.methods.toJSON = function () {
    
    const authorDoc = this
    const authorObject = authorDoc.toObject()
    delete authorObject.password
    delete authorObject.__v

    return authorObject
}

AuthorSchema.statics.verifyCredentials = async function (email, plainPW) {
    const author = this.findOne({ email })

    if(author) {
        const isMatch = await bycrpt.compare(plainPW, author.password)
        if(isMatch) {
            return author
        } else {
            return null
        }
    } else {
        return null
    }
}

export default model('Author', AuthorSchema)