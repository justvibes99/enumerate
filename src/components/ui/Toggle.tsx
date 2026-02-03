interface ToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className = "" }: ToggleProps) {
  return (
    <div
      className={`flex border border-border rounded-[var(--radius-sm)] overflow-hidden bg-surface-sunken ${className}`}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 px-4 py-2 text-sm font-body font-semibold transition-all duration-150 cursor-pointer
            ${value === option ? "bg-primary text-white" : "bg-transparent text-text-secondary hover:bg-surface-raised"}
            ${option === options[0] ? "border-r border-border" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
