import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Calculator, ImageUp } from 'lucide-react';
import SubjectInput from './components/SubjectInput.jsx';
import StreamToggle from './components/StreamToggle.jsx';
import ModeToggle from './components/ModeToggle.jsx';
import ResultCard from './components/ResultCard.jsx';
import ResultReveal from './components/ResultReveal.jsx';
import LearnMore from './components/LearnMore.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import { STREAMS } from './data/streams.js';
import { calculateTotal, getGrade } from './data/grading.js';
import useLocalStorage from './hooks/useLocalStorage.js';

const STORAGE_KEY = 'bacii-calculator-v2';
const INITIAL_STATE = {
  stream: 'science',
  mode: 'slorn',
  scores: { science: {}, social: {} },
  headerImage: '',
};

function resizeHeaderImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That file could not be opened as an image.'));
      image.onload = () => {
        const size = 256;
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Your browser could not process that image.'));
          return;
        }
        context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        resolve(canvas.toDataURL('image/webp', 0.85));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [saved, setSaved] = useLocalStorage(STORAGE_KEY, INITIAL_STATE);
  const imageInput = useRef(null);
  const [imageError, setImageError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [incompleteHint, setIncompleteHint] = useState(false);
  const closeReveal = useCallback(() => setRevealOpen(false), []);

  const streamKey = STREAMS[saved.stream] ? saved.stream : 'science';
  const mode = saved.mode === 'pheii' ? 'pheii' : 'slorn';
  const stream = STREAMS[streamKey];
  const subjects = stream.subjects;
  const scores = saved.scores?.[streamKey] ?? {};
  const total = calculateTotal(subjects, scores);
  const grade = getGrade(total);
  const allFilled = subjects.every((subject) => scores[subject.id] !== undefined && scores[subject.id] !== '');

  const changeScore = (subject, rawValue) => {
    const value = rawValue === ''
      ? ''
      : Math.min(subject.max, Math.max(0, Number(rawValue) || 0));
    setSaved((current) => ({
      ...current,
      scores: {
        ...(current.scores ?? INITIAL_STATE.scores),
        [streamKey]: { ...(current.scores?.[streamKey] ?? {}), [subject.id]: value },
      },
    }));
    setIncompleteHint(false);
  };

  const changeStream = (nextStream) => {
    setSaved((current) => ({ ...current, stream: nextStream }));
    setIncompleteHint(false);
    setDetailsOpen(false);
    setRevealOpen(false);
  };

  const changeMode = (nextMode) => {
    setSaved((current) => ({ ...current, mode: nextMode }));
    setIncompleteHint(false);
    setRevealOpen(false);
  };

  const revealResult = () => {
    if (!allFilled) {
      setIncompleteHint(true);
      return;
    }
    setRevealOpen(true);
  };

  const resetCurrentScores = () => {
    setSaved((current) => ({
      ...current,
      scores: { ...(current.scores ?? INITIAL_STATE.scores), [streamKey]: {} },
    }));
    setIncompleteHint(false);
    setRevealOpen(false);
  };

  const uploadHeaderImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setImageError('Choose a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Choose an image smaller than 5 MB.');
      return;
    }
    try {
      const headerImage = await resizeHeaderImage(file);
      setSaved((current) => ({ ...current, headerImage }));
      setImageError('');
    } catch (error) {
      console.error('Unable to use the uploaded header image.', error);
      setImageError(error.message);
    }
  };

  return (
    <>
      <div className="blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <main className="app">
        <header className="header">
          <button
            className="flag-upload"
            type="button"
            onClick={() => imageInput.current?.click()}
            aria-label={saved.headerImage ? 'Change header image' : 'Upload header image'}
            title="Upload a header image"
          >
            {saved.headerImage ? (
              <img className="flag-image" src={saved.headerImage} alt="" />
            ) : (
              <span className="flag">A</span>
            )}
            <span className="upload-indicator" aria-hidden="true"><ImageUp size={13} /></span>
          </button>
          <input
            ref={imageInput}
            className="visually-hidden"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={uploadHeaderImage}
            aria-label="Choose header image"
          />
          <div>
            <h1 className="title">BACII <span className="grad-text">Calculator</span></h1>
            <p className="subtitle">By God Kenzel</p>
          </div>
          <Calculator className="header-icon" size={26} aria-hidden="true" />
        </header>
        {imageError && <p className="header-image-error" role="alert">{imageError}</p>}

        <StreamToggle value={streamKey} onChange={changeStream} />
        <ModeToggle value={mode} onChange={changeMode} />

        <section className="grid" aria-label={`${stream.name} subject scores`}>
          {subjects.map((subject) => (
            <SubjectInput
              key={`${streamKey}-${subject.id}`}
              subject={subject}
              value={scores[subject.id] ?? ''}
              onChange={(value) => changeScore(subject, value)}
            />
          ))}
        </section>
        <p className="note">
          Foreign Language: only marks above 25 count toward the total.
          <span lang="km">ភាសាបរទេសគិតតែពិន្ទុលើសពី ២៥ ប៉ុណ្ណោះ។</span>
        </p>
        <LearnMore />
      </main>

      {mode === 'slorn' ? (
        <ResultCard
          total={total}
          grade={grade}
          subjects={subjects}
          scores={scores}
          detailsOpen={detailsOpen}
          onToggleDetails={() => setDetailsOpen((open) => !open)}
        />
      ) : (
        <div className="reveal-launch">
          {incompleteHint && !allFilled && (
            <p className="reveal-hint" role="status">Fill all subjects to reveal</p>
          )}
          <button className="reveal-button" type="button" onClick={revealResult}>
            Reveal My Result
          </button>
        </div>
      )}

      <AnimatePresence>
        {revealOpen && mode === 'pheii' && (
          <ResultReveal
            total={total}
            grade={grade}
            subjects={subjects}
            scores={scores}
            stream={stream}
            onClose={closeReveal}
            onReset={resetCurrentScores}
          />
        )}
      </AnimatePresence>
      <InstallPrompt />
    </>
  );
}
