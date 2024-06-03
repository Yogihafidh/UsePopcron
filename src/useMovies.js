import { useState, useEffect } from "react";

const KEY = "8b7433cd";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // The AbortController API
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          // Set signal property
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fatching movies");

          const data = await res.json();

          if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
          }

          // Jika query tidak ditemukan
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          // Setting up Error
          if (err.name !== "AbortError") {
            setError(err.message);
            console.error(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();

      // Clean up Fungsi
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
