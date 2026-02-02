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
        className="text-sm font-heading font-bold text-ink/60 no-underline hover:text-ink"
      >
        ← Back to Home
      </Link>
      <h1 className="font-heading font-bold text-3xl text-ink mt-4 mb-6">
        Settings
      </h1>

      <Card className="mb-6">
        <h2 className="font-heading font-bold text-xl text-ink mb-4">
          Study Settings
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-heading font-bold uppercase tracking-wider text-ink mb-1">
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
          <p className="text-xs text-ink/50 mt-1">
            Maximum number of new cards introduced per study session.
          </p>
        </div>
        <Button onClick={handleSave} size="sm">
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </Card>

      <Card className="mb-6">
        <h2 className="font-heading font-bold text-xl text-ink mb-4">
          Data Management
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-ink/60 mb-2">
              Export all your data as a JSON file for backup.
            </p>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Export All Data
            </Button>
          </div>
          <div>
            <p className="text-sm text-ink/60 mb-2">
              Import data from a backup file. This merges with existing data.
            </p>
            <label className="inline-block bg-cream text-ink border-3 border-ink shadow-brutal rounded px-4 py-2 font-heading font-bold text-sm cursor-pointer transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm">
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            {importStatus && (
              <p className="text-sm font-bold text-ink mt-2">{importStatus}</p>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
