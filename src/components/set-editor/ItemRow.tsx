import { Input } from "../ui/Input";

interface ItemRowProps {
  index: number;
  prompt: string;
  match: string;
  onPromptChange: (value: string) => void;
  onMatchChange: (value: string) => void;
  onDelete: () => void;
  promptLabel: string;
  matchLabel: string;
}

export function ItemRow({
  index,
  prompt,
  match,
  onPromptChange,
  onMatchChange,
  onDelete,
  promptLabel,
  matchLabel,
}: ItemRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-ink/40 w-8 text-right shrink-0">
        {index + 1}
      </span>
      <Input
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder={promptLabel}
        className="flex-1"
      />
      <Input
        value={match}
        onChange={(e) => onMatchChange(e.target.value)}
        placeholder={matchLabel}
        className="flex-1"
      />
      <button
        onClick={onDelete}
        className="w-10 h-10 border-3 border-ink rounded bg-cream text-ink font-bold
          cursor-pointer transition-all duration-100 hover:bg-coral shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
