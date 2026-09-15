import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content;

    return NextResponse.json({
      message: answer || "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("NVIDIA API error:", error);

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}