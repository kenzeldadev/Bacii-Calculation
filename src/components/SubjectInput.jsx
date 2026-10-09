export default function SubjectInput({ subject, value, onChange }) {
  const pct = Math.min(100, ((Number(value) || 0) / subject.max) * 100);
  return (
    <label className="card subject">
      <span className="subject-name">{subject.name}</span>
      <span className="subject-khmer" lang="km">{subject.khmer}</span>
      <div className="subject-row">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          max={subject.max}
          step="any"
          placeholder="0"
          aria-label={`${subject.name} score, maximum ${subject.max}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="subject-max">/ {subject.max}</span>
      </div>
      <div className="bar" aria-hidden="true"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
    </label>
  );
}
