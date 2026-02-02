export interface GeneratedSet {
  title: string;
  description: string;
  promptLabel: string;
  matchLabel: string;
  items: Array<{ prompt: string; match: string }>;
}

export async function generateSet(
  apiKey: string,
  topic: string,
): Promise<GeneratedSet> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system:
        "You generate study sets for a flashcard app. Respond with ONLY valid JSON, no markdown fences or explanation. The JSON must match this schema: { title: string, description: string, promptLabel: string, matchLabel: string, items: Array<{ prompt: string, match: string }> }. Generate 10-30 items. Choose appropriate promptLabel and matchLabel for the topic (e.g. \"Country\" / \"Capital\", \"Term\" / \"Definition\").",
      messages: [
        {
          role: "user",
          content: `Generate a study set about: ${topic}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text: string = data.content[0].text;

  // Strip markdown fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim();

  return JSON.parse(cleaned) as GeneratedSet;
}
