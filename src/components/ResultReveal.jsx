import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Share2, X } from 'lucide-react';
import { subjectContribution } from '../data/grading.js';

export default function ResultReveal({ total, grade, subjects, scores, stream, onClose, onReset }) {
  const shareArea = useRef(null);
  const [busy, setBusy] = useState(false);
  const [shareError, setShareError] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    if (grade.letter === 'A') {
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.68 },
        colors: ['#a855f7', '#ec4899', '#ffffff'],
      });
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [grade.letter, onClose]);

  const share = async () => {
    setBusy(true);
    setShareError('');
    try {
      const canvas = await html2canvas(shareArea.current, { backgroundColor: '#0f172a', scale: 2 });
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Could not create the result image.')), 'image/png');
      });
      const file = new File([blob], 'bacii-result.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: 'My BACII result' });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bacii-result.png';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Unable to share BACII result.', error);
        setShareError('Could not prepare the share image. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="reveal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Your BACII result"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button className="close" type="button" onClick={onClose} aria-label="Close result">
          <X size={22} />
        </button>
        <motion.div
          ref={shareArea}
          className="share-area card"
          style={{ '--grade': `var(--grade-${grade.letter})` }}
          initial={{ y: 36, scale: 0.94 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 23 }}
        >
          <p className="label">🇰🇭 BACII · {stream.name}</p>
          <motion.div
            className="big-grade"
            animate={{ textShadow: ['0 0 24px var(--grade)', '0 0 64px var(--grade)', '0 0 24px var(--grade)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {grade.letter}
          </motion.div>
          <p className="big-total"><CountUp end={total} duration={1.3} /> <small>/ 500</small></p>
          <p className="grade-name" lang="km">{grade.khmer} · {grade.english}</p>
          <ul className="breakdown">
            {subjects.map((subject) => {
              const score = Number(scores[subject.id]) || 0;
              return (
                <li key={subject.id}>
                  <span>{subject.name}<small lang="km">{subject.khmer}</small></span>
                  <span>
                    {score}/{subject.max}
                    {subject.foreign && <em> → counts {subjectContribution(subject, score)}</em>}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>
        {shareError && <p className="share-error" role="alert">{shareError}</p>}
        <div className="reveal-actions">
          <button className="share-btn" type="button" onClick={share} disabled={busy}>
            <Share2 size={18} /> {busy ? 'Preparing…' : 'Share'}
          </button>
          <button className="try-again-btn" type="button" onClick={onReset}>Try Again</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
