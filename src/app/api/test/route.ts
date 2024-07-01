import { GoogleGenerativeAI } from "@google/generative-ai";
import { useChat } from "ai/react";

export async function POST() {
    const prompt = "Once upon a time";
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });
    let res = await model.generateContentStream(prompt);
    console.log(data);
    return Response.json({
        prompt,
    });
}