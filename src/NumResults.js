export default function NumResults(movies) {
  return (
    <p className="num-results">
      Found <strong>{movies?.movies?.length}</strong> results
    </p>
  );
}
