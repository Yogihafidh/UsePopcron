import { Children, useState, useEffect } from "react";
import { tempMovieData, tempWatchedData } from "./data";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage.js";
import NavBar from "./NavBar.js";
import Search from "./Search.js";
import Main from "./Main.js";
import Box from "./Box.js";
import NumResults from "./NumResults.js";
import MovieList from "./MovieList.js";
import MovieDetails from "./MovieDetails.js";
import WatchedSummary from "./WatchedSummary.js";
import WatchedMovieList from "./WatchedMovieList.js";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "8b7433cd";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handleSelectMovie(id) {
    setSelectedID(() => (id === selectedID ? null : id));
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    setWatched(() => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(() => watched.filter((movie) => id !== movie.imdbID));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

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

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {
            // Jika loading = true
            isLoading && <Loader />
          }
          {
            // Jika loading = true dan error = false
            !isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )
          }
          {
            // Jika error = true (terdapat nilai-nya)
            error && <ErrorMessage message={error} />
          }
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
