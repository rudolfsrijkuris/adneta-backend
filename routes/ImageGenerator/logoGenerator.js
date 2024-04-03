import express from "express";
import { OpenAIApi, Configuration } from "openai";
import dotenv from "dotenv";
import { createProdia } from "prodia";

dotenv.config();

const router = express.Router();

// OpenAI API Configuration
const configuration = new Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prodia = createProdia({
	apiKey: process.env.PRODIA_KEY,
});

router.post("/logo-generator", async (req, res) => {
    // const { imagePrompt } = req.body;
    // console.log(content);
    // const completion = await openai.createImage({
    //     prompt: `${imagePrompt}`,
    //     n: 1,
    //     size: "1024x1024"
    // });

    // const imageUrl = completion.data.data[0].url;

    const { imagePrompt } = req.body;

    const job = await prodia.generate({
        prompt: `${imagePrompt}`,
    });
    
    const { imageUrl, status } = await prodia.wait(job);

    console.log(imageUrl);
    console.log(status);

    // sdk.generate({
    //     model: 'Realistic_Vision_V2.0.safetensors [79587710]',
    //     prompt: `${imagePrompt}`
    //   })
    // .then(({ data }) => imageUrl = data)
    // .catch(err => console.error(err));

    // console.log(imageUrl)
    
    res.json({
        data: imageUrl,
    });
});

export default router;