import { useState, useEffect } from "react";
export function useLocalStorageState(initialState, key) {
  // Get Value from Localstorage
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // Set Value to Loacalstorage
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  // Return Value
  return [value, setValue];
}
