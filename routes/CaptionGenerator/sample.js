import express from "express";
import { OpenAIApi, Configuration } from "openai-node";

const router = express.Router();

// OpenAI API Configuration
const configuration = new Configuration({
    organization: "org-vxiGJZvmY3RmN6iBf1NBTfs0",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

router.post("/instagram-caption-generator", async (req, res) => {

});

export default router;