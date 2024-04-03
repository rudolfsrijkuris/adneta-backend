import express from "express";
import { OpenAIApi, Configuration } from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// OpenAI API Configuration
const configuration = new Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/facebook-caption-generator", async (req, res) => {
    const { content } = req.body;
    
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a social media marketing specialist." },
            { role: "user", content: `Write a caption for Facebook post about ${content}` },
        ],
        temperature: 1,
    });

    const generatedMessage = completion.data.choices[0].message.content;

    res.json({
        data: generatedMessage,
    });
});

export default router;