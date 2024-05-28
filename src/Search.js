import { useRef, useEffect } from "react";

export default function Search({ query, setQuery }) {
  // Declaration useRef
  const inputEl = useRef(null);

  // Using effect
  useEffect(
    function () {
      function callback(e) {
        // Jika input element focus() maka return
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);

      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  );

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
