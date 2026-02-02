import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DataSet } from "../../types";
import { saveDataSet } from "../../lib/storage";
import { Input, Textarea } from "../ui/Input";
import { Button } from "../ui/Button";
import { ItemRow } from "./ItemRow";
import { BulkImport } from "./BulkImport";

const ACCENT_COLORS = [
  "#4ECDC4",
  "#FFE66D",
  "#FF6B6B",
  "#95E1D3",
  "#AA96DA",
  "#F38181",
];

interface SetEditorFormProps {
  existingSet?: DataSet;
}

export function SetEditorForm({ existingSet }: SetEditorFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(existingSet?.title ?? "");
  const [description, setDescription] = useState(
    existingSet?.description ?? "",
  );
  const [promptLabel, setPromptLabel] = useState(
    existingSet?.promptLabel ?? "Term",
  );
  const [matchLabel, setMatchLabel] = useState(
    existingSet?.matchLabel ?? "Definition",
  );
  const [accentColor, setAccentColor] = useState(
    existingSet?.accentColor ?? ACCENT_COLORS[0],
  );
  const [items, setItems] = useState<Array<{ id: string; prompt: string; match: string }>>(
    existingSet?.items.map((i) => ({ ...i })) ?? [
      { id: crypto.randomUUID(), prompt: "", match: "" },
      { id: crypto.randomUUID(), prompt: "", match: "" },
      { id: crypto.randomUUID(), prompt: "", match: "" },
      { id: crypto.randomUUID(), prompt: "", match: "" },
    ],
  );
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSave = async () => {
    const newErrors: string[] = [];
    if (!title.trim()) newErrors.push("Title is required");
    const validItems = items.filter(
      (i) => i.prompt.trim() && i.match.trim(),
    );
    if (validItems.length < 4)
      newErrors.push("At least 4 items are required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const now = Date.now();
    const dataSet: DataSet = {
      id: existingSet?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      icon: existingSet?.icon ?? "✏️",
      accentColor,
      promptLabel: promptLabel.trim() || "Term",
      matchLabel: matchLabel.trim() || "Definition",
      isBuiltIn: false,
      createdAt: existingSet?.createdAt ?? now,
      updatedAt: now,
      items: validItems.map((i) => ({
        id: i.id,
        prompt: i.prompt.trim(),
        match: i.match.trim(),
      })),
    };

    await saveDataSet(dataSet);
    navigate(`/set/${dataSet.id}`);
  };

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), prompt: "", match: "" }]);
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: "prompt" | "match",
    value: string,
  ) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleBulkImport = (
    imported: Array<{ prompt: string; match: string }>,
  ) => {
    const newItems = imported.map((i) => ({
      id: crypto.randomUUID(),
      prompt: i.prompt,
      match: i.match,
    }));
    setItems([...items, ...newItems]);
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-heading font-bold uppercase tracking-wider text-ink mb-1">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Study Set"
            error={errors.some((e) => e.includes("Title"))}
          />
        </div>
        <div>
          <label className="block text-sm font-heading font-bold uppercase tracking-wider text-ink mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of this set"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-heading font-bold uppercase tracking-wider text-ink mb-1">
              Prompt Label
            </label>
            <Input
              value={promptLabel}
              onChange={(e) => setPromptLabel(e.target.value)}
              placeholder="Term"
            />
          </div>
          <div>
            <label className="block text-sm font-heading font-bold uppercase tracking-wider text-ink mb-1">
              Match Label
            </label>
            <Input
              value={matchLabel}
              onChange={(e) => setMatchLabel(e.target.value)}
              placeholder="Definition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-heading font-bold uppercase tracking-wider text-ink mb-2">
            Accent Color
          </label>
          <div className="flex gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-10 h-10 rounded border-3 cursor-pointer transition-all duration-100
                  ${accentColor === color ? "border-ink shadow-brutal scale-110" : "border-ink/30 hover:border-ink"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-ink">
            Items ({items.length})
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowBulkImport(true)}
          >
            Bulk Import
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <ItemRow
              key={item.id}
              index={i}
              prompt={item.prompt}
              match={item.match}
              onPromptChange={(v) => updateItem(i, "prompt", v)}
              onMatchChange={(v) => updateItem(i, "match", v)}
              onDelete={() => deleteItem(i)}
              promptLabel={promptLabel}
              matchLabel={matchLabel}
            />
          ))}
        </div>
        <Button
          variant="primary"
          size="sm"
          className="mt-3"
          onClick={addItem}
        >
          + Add Item
        </Button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-coral border-3 border-ink rounded p-4 mb-4">
          {errors.map((e) => (
            <p key={e} className="font-bold text-ink text-sm">
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave}>Save Set</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>

      <BulkImport
        open={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
}
