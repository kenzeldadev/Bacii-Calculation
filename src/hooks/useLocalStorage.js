import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : { ...initialValue, ...JSON.parse(stored) };
    } catch (error) {
      console.error(`Unable to read local storage key "${key}".`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save local storage key "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
