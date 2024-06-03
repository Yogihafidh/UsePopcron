import { useState, useEffect } from "react";
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
import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStorageState.js";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "8b7433cd";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const { movies, isLoading, error } = useMovies(query);

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
