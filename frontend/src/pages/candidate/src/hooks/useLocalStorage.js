import { useCallback, useEffect, useState } from 'react';

/**
 * Small persistence helper so the Candidate Portal behaves like a real app
 * (state survives a refresh) while the backend endpoints in
 * backend/src/HireMind.Api are still being built out.
 *
 * @param {string} key
 * @param {*} initialValue
 * @returns {[*, (value: *) => void]}
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage: could not read "${key}"`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`useLocalStorage: could not persist "${key}"`, err);
    }
  }, [key, value]);

  const update = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  return [value, update];
}
