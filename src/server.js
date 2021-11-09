import express from 'express';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import mongoose from 'mongoose';
import blogPostRouter from './APIs/index.js'


const server = express();


server.use(cors())
server.use(express.json())
server.use('/posts', blogPostRouter)



const { PORT, MONGO_CONNECTION } = process.env

mongoose.connect(MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
    console.log('Mongo Connected 🟢 🟢')
})

server.listen(PORT, () => {
    
    console.table(listEndpoints(server))

    console.log('listening on port', PORT)
})

mongoose.connection.on('error', err => {
    console.log(err)
})