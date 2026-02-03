import { useState } from "react";
import { generateSet, type GeneratedSet } from "../../lib/generate-set";
import { Button } from "../ui/Button";

interface AIGenerateProps {
  onGenerated: (data: GeneratedSet) => void;
}

export function AIGenerate({ onGenerated }: AIGenerateProps) {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!__ANTHROPIC_API_KEY__) {
    return null;
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const data = await generateSet(topic.trim());
      onGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border border-border rounded-[var(--radius)] bg-surface-raised p-4">
      <h3 className="font-heading text-lg text-text-primary mb-2">
        Generate with AI
      </h3>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Describe what you want to study, e.g. &quot;European country capitals&quot; or &quot;Basic Japanese greetings&quot;"
        rows={2}
        className="w-full bg-surface-raised border border-border rounded-[var(--radius-sm)] px-3 py-2 text-base font-body text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary focus:shadow-focus mb-3 resize-none"
      />
      {error && (
        <p className="text-sm text-error font-bold mb-2">{error}</p>
      )}
      <Button
        onClick={handleGenerate}
        disabled={generating || !topic.trim()}
        size="sm"
      >
        {generating ? "Generating..." : "Generate with AI"}
      </Button>
    </div>
  );
}
