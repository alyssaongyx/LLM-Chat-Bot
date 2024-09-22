import { NextRequest, NextResponse } from "next/server";

let llmProperties = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 150,
};

export async function GET() {
  return NextResponse.json(llmProperties);
}

export async function PUT(req: NextRequest) {
  const newProperties = await req.json();
  llmProperties = { ...llmProperties, ...newProperties };
  return NextResponse.json(llmProperties);
}
