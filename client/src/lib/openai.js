import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file in root directory

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_PUBLIC_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a companion to a 3 year old girl." },
    {
      role: "user",
      content: "Write a very short poem about life.",
    },
  ],
});

console.log(completion.choices[0].message.content);

export default completion;
