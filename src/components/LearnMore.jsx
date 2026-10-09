import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ZoomIn } from 'lucide-react';
import Lightbox from './Lightbox.jsx';

const references = [
  { src: '/references/moeys-subjects.png', caption: 'Subject scores by stream' },
  { src: '/references/moeys-thresholds.png', caption: 'Grade thresholds (A–F)' },
];

export default function LearnMore() {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <section className="learn-more">
      <button
        className="learn-toggle card"
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        <BookOpen size={19} />
        <span>How is my grade calculated? — Tap to learn more</span>
        <span className="learn-indicator">{expanded ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="learn-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
          >
            <div className="learn-inner">
              <p>
                Your BACII grade is calculated from a total of 500 points. Each subject has a maximum score,
                and the Foreign Language score only counts marks above 25.
              </p>
              <p lang="km" className="khmer-copy">
                ពិន្ទុបាក់ឌុបគណនាចេញពីពិន្ទុសរុប ៥០០។ មុខវិជ្ជានីមួយៗមានពិន្ទុអតិបរមា ហើយភាសាបរទេសគិតតែពិន្ទុលើសពី ២៥ ប៉ុណ្ណោះ។
              </p>
              <div className="formula-card card">
                Total = Σ(subjects) + max(0, ForeignLanguage − 25)
              </div>

              <div className="reference-heading">
                <h2>Official MoEYS Reference</h2>
                <p>Source: Ministry of Education, Youth and Sport (MoEYS) Cambodia</p>
              </div>
              <div className="reference-list">
                {references.map((reference) => (
                  <figure className="reference-card card" key={reference.src}>
                    {failedImages[reference.src] ? (
                      <div className="reference-placeholder">Image not available</div>
                    ) : (
                      <button
                        type="button"
                        className="reference-image-button"
                        onClick={() => setLightbox(reference)}
                        aria-label={`Zoom: ${reference.caption}`}
                      >
                        <img
                          src={reference.src}
                          alt={reference.caption}
                          onError={() => setFailedImages((images) => ({ ...images, [reference.src]: true }))}
                        />
                        <span className="zoom-icon"><ZoomIn size={19} /></span>
                      </button>
                    )}
                    <figcaption>{reference.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="foreign-note">
                Foreign Language below 25 contributes 0 points.
                <span lang="km" className="khmer-copy">ភាសាបរទេសក្រោម ២៥ ពិន្ទុ មិនបូកបញ្ចូលទេ។</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Lightbox image={lightbox} onClose={closeLightbox} />
    </section>
  );
}
