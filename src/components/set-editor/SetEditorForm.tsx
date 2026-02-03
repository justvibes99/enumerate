import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { DataSet } from "../../types";
import type { GeneratedSet } from "../../lib/generate-set";
import { saveDataSet } from "../../lib/storage";
import { Input, Textarea } from "../ui/Input";
import { Button } from "../ui/Button";
import { ItemRow } from "./ItemRow";
import { BulkImport } from "./BulkImport";

const ACCENT_COLORS = [
  "#2A664D",
  "#7D2827",
  "#252E48",
  "#58402F",
  "#6D4E4B",
  "#3B4229",
];

interface SetEditorFormProps {
  existingSet?: DataSet;
  aiData?: GeneratedSet;
}

export function SetEditorForm({ existingSet, aiData }: SetEditorFormProps) {
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

  // Populate form when AI data arrives
  useEffect(() => {
    if (!aiData) return;
    setTitle(aiData.title);
    setDescription(aiData.description);
    setPromptLabel(aiData.promptLabel);
    setMatchLabel(aiData.matchLabel);
    setItems(
      aiData.items.map((i) => ({
        id: crypto.randomUUID(),
        prompt: i.prompt,
        match: i.match,
      })),
    );
  }, [aiData]);

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
      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-body font-medium text-text-secondary mb-1">
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
          <label className="block text-sm font-body font-medium text-text-secondary mb-1">
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
            <label className="block text-sm font-body font-medium text-text-secondary mb-1">
              Prompt Label
            </label>
            <Input
              value={promptLabel}
              onChange={(e) => setPromptLabel(e.target.value)}
              placeholder="Term"
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-text-secondary mb-1">
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
          <label className="block text-sm font-body font-medium text-text-secondary mb-2">
            Accent Color
          </label>
          <div className="flex gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-10 h-10 rounded-[var(--radius-sm)] border cursor-pointer transition-all duration-150
                  ${accentColor === color ? "border-text-primary shadow-focus scale-110" : "border-border hover:border-border-strong"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-lg text-text-primary">
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
        <div className="flex justify-end mt-3">
          <Button
            variant="success"
            size="sm"
            onClick={addItem}
          >
            + Add Item
          </Button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-error-light border border-error/30 rounded-[var(--radius)] p-4 mb-4">
          {errors.map((e) => (
            <p key={e} className="font-bold text-error text-sm">
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
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
