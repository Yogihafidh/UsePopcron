import { useRef, useEffect } from "react";
import { useKey } from "./useKey";

export default function Search({ query, setQuery }) {
  // Declaration useRef
  const inputEl = useRef(null);

  // Using effect
  useKey("Enter", function () {
    // Jika input element focus() maka return
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      // Connected ref with element using prop
      ref={inputEl}
    />
  );
}
