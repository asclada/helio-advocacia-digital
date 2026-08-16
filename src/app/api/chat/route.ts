import { NextRequest, NextResponse } from "next/server";

// Stateless proxy: forwards chat widget messages to the n8n workflow that
// owns triage logic and LLM calls. This route never talks to an LLM and
// never persists conversation state — see openspec/specs/site-foundation.
export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Chat is not configured: N8N_WEBHOOK_URL is not set." },
      { status: 500 },
    );
  }

  const body = await request.json();

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await webhookResponse.json();

  return NextResponse.json(data, { status: webhookResponse.status });
}
