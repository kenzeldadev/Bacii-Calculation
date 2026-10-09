import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ChevronDown } from 'lucide-react';
import { MAX_TOTAL, subjectContribution } from '../data/grading.js';

const R = 52;
const C = 2 * Math.PI * R;

export default function ResultCard({ total, grade, subjects, scores, detailsOpen, onToggleDetails }) {
  return (
    <section className="result-wrap" style={{ '--grade': `var(--grade-${grade.letter})` }} aria-label="Live result">
      <div className="result">
        <div className="ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring-bg" cx="60" cy="60" r={R} />
            <motion.circle
              className="ring-fg"
              cx="60"
              cy="60"
              r={R}
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - total / MAX_TOTAL) }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          </svg>
          <div className="ring-num">
            <CountUp end={total} duration={0.6} preserveValue decimals={total % 1 ? 1 : 0} />
            <small>/ 500</small>
          </div>
        </div>

        <div className="result-info">
          <span className="label">Your grade</span>
          <motion.span
            key={grade.letter}
            className="grade"
            initial={{ scale: 1.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          >
            {grade.letter}
          </motion.span>
          <span className="grade-name" lang="km">{grade.khmer} · {grade.english}</span>
        </div>
        <button
          className="details-button"
          type="button"
          onClick={onToggleDetails}
          aria-expanded={detailsOpen}
        >
          <ChevronDown size={17} className={detailsOpen ? 'chevron-open' : ''} />
          Details
        </button>
      </div>

      {detailsOpen && (
        <div className="result-details">
          {subjects.map((subject) => {
            const score = Number(scores[subject.id]) || 0;
            return (
              <div className="detail-row" key={subject.id}>
                <span>{subject.name}</span>
                <span>{score}/{subject.max}{subject.foreign ? ` · counts ${subjectContribution(subject, score)}` : ''}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
