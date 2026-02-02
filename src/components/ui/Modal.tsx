import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />
      <div className="relative bg-cream border-3 border-ink shadow-brutal-lg rounded max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="bg-lavender border-b-3 border-ink px-6 py-4 rounded-t">
          <h2 className="font-heading font-bold text-xl text-ink">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
