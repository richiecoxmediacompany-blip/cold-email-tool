import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured. Add it to your environment variables." },
      { status: 500 }
    );
  }

  try {
    const { yourName, companyName, offering, targetCompany, targetRole } =
      await req.json();

    if (!yourName || !companyName || !offering || !targetCompany || !targetRole) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Write a cold email with these details:

- Sender: ${yourName} from ${companyName}
- What they offer: ${offering}
- Target company: ${targetCompany}
- Target person's role: ${targetRole}

Requirements:
- 3-4 paragraphs maximum
- Professional but conversational tone — sound like a real person, not a template
- Open with something relevant to the target's role or company, not a generic intro
- Clearly explain the value proposition in 1-2 sentences
- End with a specific, low-friction call to action (e.g., "Would a 15-minute call this week work?")
- Include a subject line on the first line prefixed with "Subject: "
- Do NOT include any placeholders like [Name] — use the actual details provided
- Do NOT include any meta-commentary, just output the email`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const email = textBlock?.text ?? "";

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Generation error:", error);

    const message =
      error instanceof Anthropic.AuthenticationError
        ? "Invalid API key. Check your ANTHROPIC_API_KEY."
        : "Failed to generate email. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
