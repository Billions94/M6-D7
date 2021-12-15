import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET

export const tokenGenerator = async (author) => {
    const accessToken = await generateJWTToken({_id: author._id})
    return accessToken
}

const generateJWTToken = (payload) => {
   return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "15m"}, (err, token) => {
            if(err) reject(err)
            else resolve(token)
        })
    })
}

export const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) reject(err)
            else resolve(decodedToken)
        })
    })
}