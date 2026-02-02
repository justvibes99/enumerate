import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Textarea } from "../ui/Input";
import { Button } from "../ui/Button";

interface BulkImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (items: Array<{ prompt: string; match: string }>) => void;
}

export function BulkImport({ open, onClose, onImport }: BulkImportProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    setError("");
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError("No data found. Paste tab-separated or comma-separated pairs.");
      return;
    }

    const items: Array<{ prompt: string; match: string }> = [];

    for (const line of lines) {
      // Try tab first, then comma
      let parts = line.split("\t");
      if (parts.length < 2) {
        parts = line.split(",");
      }
      if (parts.length < 2) {
        setError(
          `Could not parse line: "${line}". Use tab or comma to separate prompt and match.`,
        );
        return;
      }
      items.push({
        prompt: parts[0].trim(),
        match: parts[1].trim(),
      });
    }

    onImport(items);
    setText("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Bulk Import">
      <p className="text-sm text-text-secondary mb-3">
        Paste tab-separated or comma-separated data. One pair per line.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Alabama\tMontgomery\nAlaska\tJuneau"}
        rows={8}
      />
      {error && (
        <p className="text-sm text-error font-bold mt-2">{error}</p>
      )}
      <div className="flex gap-3 mt-4">
        <Button onClick={handleImport}>Import</Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
