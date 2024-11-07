import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

// Use the CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

const connect = async () => {
  try {
    console.log("Connecting to MongoDB...", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Successfully Connected to MongoDB\nServer running on port ${port}`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
  connect();
});
