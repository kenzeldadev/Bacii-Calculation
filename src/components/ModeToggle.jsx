import { motion } from 'framer-motion';

const modes = [
  { id: 'slorn', label: 'Slorn mode' },
  { id: 'pheii', label: 'buk pous mode' },
];

export default function ModeToggle({ value, onChange }) {
  return (
    <div className="toggle mode-toggle" role="tablist" aria-label="Result mode">
      <motion.span
        className="toggle-thumb"
        animate={{ x: value === 'slorn' ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
      {modes.map((mode) => (
        <button
          key={mode.id}
          role="tab"
          aria-selected={value === mode.id}
          onClick={() => onChange(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

