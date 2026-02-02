import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HomePage } from "./pages/HomePage";
import { SetDetailPage } from "./pages/SetDetailPage";
import { SetEditorPage } from "./pages/SetEditorPage";
import { FlashcardPage } from "./pages/FlashcardPage";
import { MultipleChoicePage } from "./pages/MultipleChoicePage";
import { TypedAnswerPage } from "./pages/TypedAnswerPage";
import { StatsPage } from "./pages/StatsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-cream">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/set/new" element={<SetEditorPage />} />
            <Route path="/set/:id" element={<SetDetailPage />} />
            <Route path="/set/:id/edit" element={<SetEditorPage />} />
            <Route path="/set/:id/flashcard" element={<FlashcardPage />} />
            <Route
              path="/set/:id/multiple-choice"
              element={<MultipleChoicePage />}
            />
            <Route
              path="/set/:id/typed-answer"
              element={<TypedAnswerPage />}
            />
            <Route path="/set/:id/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
