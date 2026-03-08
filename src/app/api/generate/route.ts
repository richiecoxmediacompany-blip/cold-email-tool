import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { yourName, companyName, offering, targetCompany, targetRole } =
      await req.json();

    if (!yourName || !companyName || !offering || !targetCompany || !targetRole) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { error: "Failed to generate email. Check your API key." },
      { status: 500 }
    );
  }
}
