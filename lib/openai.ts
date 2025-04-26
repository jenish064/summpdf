import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const baseURL = "https://api.sree.shop/v1";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env?.GEMINI_API_KEY || "");

export async function generateSummaryFromAI(pdfText: string) {
  try {
    // const completion = await client.chat.completions.create({
    //   model: "deepseek-chat",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "Try to explain as 'Michael Scott' from 'The Office",
    //     },
    //     {
    //       role: "user",
    //       content: "Please summarize the following text: " + pdfText + ".",
    //     },
    //   ],
    //   temperature: 0.7,
    //   max_tokens: 1500,
    // });
    // return completion.choices[0].message.content;a

    // gemini

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =
      "Try to explain as 'Michael Scott' from 'The Office Please summarize the following text: " +
      pdfText +
      ".";

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
