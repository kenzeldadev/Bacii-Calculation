import { FlaskConical, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreamToggle({ value, onChange }) {
  return (
    <div className="toggle" role="tablist" aria-label="Exam stream">
      <motion.span
        className="toggle-thumb"
        animate={{ x: value === 'science' ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
      <button role="tab" aria-selected={value === 'science'} onClick={() => onChange('science')}>
        <FlaskConical size={16} /> Science
      </button>
      <button role="tab" aria-selected={value === 'social'} onClick={() => onChange('social')}>
        <Landmark size={16} /> Social
      </button>
    </div>
  );
}
