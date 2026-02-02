interface ToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className = "" }: ToggleProps) {
  return (
    <div
      className={`inline-flex border-3 border-ink rounded overflow-hidden ${className}`}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-2 text-sm font-heading font-bold transition-colors duration-100 cursor-pointer
            ${value === option ? "bg-yellow text-ink" : "bg-cream text-ink hover:bg-yellow/30"}
            ${option === options[0] ? "border-r-3 border-ink" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
