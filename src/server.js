import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import { badRequest, unAuthorized } from "./errorsHandler.js";
import { notFound, genericError, forbiddenHandler } from "./errorsHandler.js";
import blogPostRouter from "./APIs/blogPost/index.js";
import authorsRouter from "./APIs/authors/index.js";
import passport from "passport"
import googleCloudStrategy from "../src/Auth/Oauth.js"

const server = express();


// Middlewares
passport.use("google", googleCloudStrategy)
server.use(cors());
server.use(express.json());
server.use(passport.initialize());

// Endpoints
server.use("/posts", blogPostRouter);
server.use("/authors", authorsRouter);

// Error Middlewares
server.use(badRequest);
server.use(unAuthorized);
server.use(notFound);
server.use(forbiddenHandler);
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
