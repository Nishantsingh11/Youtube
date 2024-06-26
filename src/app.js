import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);  
// for the from data
app.use(express.json({ limit: "16kb" }));
// for the url data
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import playlistRouter from "./routes/playlist.routes.js";
// router declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
export { app };
