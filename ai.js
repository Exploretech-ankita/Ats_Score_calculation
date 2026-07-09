import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

console.log("KEY CHECK →", process.env.ANTHROPIC_API_KEY?.slice(0, 15), "... length:", process.env.ANTHROPIC_API_KEY?.length);

const router = express.Router();
const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Missing 'message' in request body" });
        }

        const response = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const textBlock = response.content.find(block => block.type === "text");

        res.json({
            reply: textBlock ? textBlock.text : ""
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "AI request failed"
        });
    }
});

export default router;