// BACII totals are out of 500; Foreign Language only contributes points above 25.
export const MAX_TOTAL = 500;
export const FOREIGN_LANGUAGE_FLOOR = 25;

// Threshold minima are inclusive and match the supplied MoEYS grade table.
export const GRADES = [
  { letter: 'A', min: 427, max: 500, khmer: 'ល្អប្រសើរ', english: 'Excellent' },
  { letter: 'B', min: 380, max: 426, khmer: 'ល្អណាស់', english: 'Very Good' },
  { letter: 'C', min: 332, max: 379, khmer: 'ល្អ', english: 'Good' },
  { letter: 'D', min: 285, max: 331, khmer: 'ល្អបង្គួរ', english: 'Fair' },
  { letter: 'E', min: 237, max: 284, khmer: 'មធ្យម', english: 'Average' },
  { letter: 'F', min: 0, max: 236, khmer: 'ធ្លាក់', english: 'Fail' },
];

export function subjectContribution(subject, score) {
  // Ignore the first 25 points in Foreign Language, per the BACII rule.
  if (subject.foreign) return Math.max(0, score - FOREIGN_LANGUAGE_FLOOR);
  return score;
}

export function calculateTotal(subjects, scores) {
  return subjects.reduce((total, subject) => {
    const score = Number(scores[subject.id]) || 0;
    return total + subjectContribution(subject, score);
  }, 0);
}

export function getGrade(total) {
  return GRADES.find(({ min }) => total >= min) ?? GRADES[GRADES.length - 1];
}
