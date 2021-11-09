import express from 'express';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';



const server = express();


server.use(cors())
server.use(express.json())

console.table(listEndpoints(server))

const { PORT } = process.env

server.listen(PORT, () => {
    console.log('listening on port', PORT)
})