// Official subject maxima, coefficients, and Khmer labels for each BACII stream.
const sharedSubjects = [
  { id: 'khmer', name: 'Khmer', khmer: 'ភាសាខ្មែរ', max: 125, coefficient: 2 },
  { id: 'math', name: 'Mathematics', khmer: 'គណិតវិទ្យា', max: 125, coefficient: 2 },
];

const foreignLanguage = {
  id: 'foreign',
  name: 'Foreign Language',
  khmer: 'ភាសាបរទេស',
  max: 50,
  coefficient: 1,
  foreign: true,
};

export const STREAMS = {
  science: {
    id: 'science',
    name: 'Science',
    khmer: 'វិទ្យាសាស្ត្រ',
    subjects: [
      ...sharedSubjects,
      { id: 'physics', name: 'Physics', khmer: 'រូបវិទ្យា', max: 75, coefficient: 1 },
      { id: 'chemistry', name: 'Chemistry', khmer: 'គីមីវិទ្យា', max: 75, coefficient: 1 },
      { id: 'biology', name: 'Biology', khmer: 'ជីវវិទ្យា', max: 75, coefficient: 1 },
      foreignLanguage,
    ],
  },
  social: {
    id: 'social',
    name: 'Social',
    khmer: 'វិទ្យាសាស្ត្រសង្គម',
    subjects: [
      ...sharedSubjects,
      { id: 'history', name: 'History', khmer: 'ប្រវត្តិវិទ្យា', max: 75, coefficient: 1 },
      { id: 'geography', name: 'Geography', khmer: 'ភូមិវិទ្យា', max: 75, coefficient: 1 },
      { id: 'moral', name: 'Moral-Civics', khmer: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', max: 75, coefficient: 1 },
      foreignLanguage,
    ],
  },
};
