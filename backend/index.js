import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { requireAuth } from "@clerk/express";

const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

// Use the CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Use the express.json() middleware to parse the request body
app.use(express.json());

const connect = async () => {
  try {
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

app.get("/api/test", requireAuth(), (req, res) => {
  const userId = req.auth.userId;
  console.log("Success!");
  console.log("Clerk user ID:", userId);
  res.send("Success!");
});

app.post("/api/chats", requireAuth(), async (req, res) => {
  const { userId, text } = req.body;

  // Validation for required fields
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({ error: "Invalid or missing 'userId'" });
  }

  if (!text || typeof text !== "string") {
    return res.status(400).send({ error: "Invalid or missing 'text'" });
  }

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const savedChat = await newChat.save();

    // CHECK IF USERCHATS EXIST
    const userChats = await UserChats.findOne({ userId: userId });

    if (!userChats) {
      // IF USERCHATS DOES NOT EXIST, CREATE A NEW USERCHATS
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF USERCHATS EXISTS, ADD THE NEW CHAT TO THE USERCHATS
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }

    // SEND THE NEW CHAT ID
    // This is needed because we will be redirected to the chat page after creating a new chat
    res.status(201).send({ chatId: savedChat._id });
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).send({ error: "Error creating chat" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  connect();
});
