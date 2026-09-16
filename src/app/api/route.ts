import OpenAI from "openai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getClient() {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    // Avoid throwing at build time; runtime will fail gracefully in handler
    return new OpenAI({
      apiKey: "dummy-key-for-build",
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages" },
        { status: 400 }
      );
    }

    const client = getClient();
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