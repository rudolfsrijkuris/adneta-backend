import express from 'express';
import { OpenAIApi, Configuration } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// OpenAI API Configuration
const configuration = new Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/ad-idea-generator', (req, res) => {
    const { content } = req.body;
  
    openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media marketing specialist.' },
          { role: 'user', content: `Generate an ad idea for ${content}` },
        ],
        temperature: 1,
        // stream: true
    })
    .then((completion) => {
        const generatedMessage = completion.data.choices[0].message.content;
        console.log(generatedMessage);
        res.json({
        data: generatedMessage,
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    });
});

export default router;