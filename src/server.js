import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import blogPostRouter from "./APIs/blogPost/index.js";
import { badRequest, unAuthorized } from "./errorsHandler.js";
import { notFound, genericError } from "./errorsHandler.js";

const server = express();

server.use(cors());
server.use(express.json());
server.use("/posts", blogPostRouter);

server.use(badRequest);
server.use(unAuthorized);
server.use(notFound);
server.use(genericError);

const { PORT, MONGO_CONNECTION } = process.env;

mongoose.connect(MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected 🟢 🟢");
});

server.listen(PORT, () => {
  console.table(listEndpoints(server));

  console.log("listening on port", PORT);
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
