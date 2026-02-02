import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import {
  getSettings,
  saveSettings,
  exportAllData,
  importData,
} from "../lib/storage";
import type { AppSettings } from "../types";

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    id: "app-settings",
    newCardsPerDay: 15,
  });
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState<string>("");

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    const data = await exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enumerate-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importData(text);
      setImportStatus("Data imported successfully! Refresh to see changes.");
    } catch {
      setImportStatus("Failed to import data. Check the file format.");
    }
  };

  return (
    <PageContainer className="max-w-2xl">
      <Link
        to="/"
        className="text-sm font-body font-medium text-text-secondary no-underline hover:text-text-primary"
      >
        ← Back to Home
      </Link>
      <h1 className="font-heading text-3xl text-text-primary mt-4 mb-4">
        Settings
      </h1>

      <Card className="mb-4">
        <h2 className="font-heading text-xl text-text-primary mb-4">
          Study Settings
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-body font-medium text-text-secondary mb-1">
            New Cards Per Day (per set)
          </label>
          <Input
            type="number"
            min={1}
            max={50}
            value={settings.newCardsPerDay}
            onChange={(e) =>
              setSettings({
                ...settings,
                newCardsPerDay: parseInt(e.target.value) || 15,
              })
            }
            className="max-w-32"
          />
          <p className="text-xs text-text-tertiary mt-1">
            Maximum number of new cards introduced per study session.
          </p>
        </div>
        <Button onClick={handleSave} size="sm">
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </Card>

      <Card className="mb-4">
        <h2 className="font-heading text-xl text-text-primary mb-4">
          AI Generation
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-body font-medium text-text-secondary mb-1">
            Claude API Key
          </label>
          <input
            type="password"
            value={settings.claudeApiKey ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                claudeApiKey: e.target.value || undefined,
              })
            }
            placeholder="sk-ant-..."
            className="w-full bg-white border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm font-body font-mono text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary focus:shadow-focus max-w-sm"
          />
          <p className="text-xs text-text-tertiary mt-1">
            Used to generate study sets with Claude. Stored locally in your browser.
          </p>
        </div>
        <Button onClick={handleSave} size="sm">
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </Card>

      <Card className="mb-4">
        <h2 className="font-heading text-xl text-text-primary mb-4">
          Data Management
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-2">
              Export all your data as a JSON file for backup.
            </p>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Export All Data
            </Button>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-2">
              Import data from a backup file. This merges with existing data.
            </p>
            <label className="inline-block bg-surface-raised text-text-primary border border-border shadow-sm rounded-[var(--radius-sm)] px-4 py-2 font-body font-semibold text-sm cursor-pointer transition-all duration-150 hover:border-border-strong hover:shadow-md">
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            {importStatus && (
              <p className="text-sm font-bold text-text-primary mt-2">{importStatus}</p>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
