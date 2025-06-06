import Link from "next/link";
import { useRouter } from "next/navigation";

const MovieCard = ({ movie }) => {
  const router = useRouter();

  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Format release date to just the year
  const formatReleaseYear = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  const handleBookTickets = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/movies/${movie.movie_id}/showtimes`);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link href={`/movies/${movie.movie_id}`} className="block">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded-full flex items-center text-xs shadow-md">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.rating?.toFixed(1) || "N/A"}
          </div>

          {/* Overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-lg font-bold text-white">{movie.title}</h3>

            {/* Movie metadata */}
            <div className="flex items-center text-xs text-gray-300 mt-1">
              <span>{formatReleaseYear(movie.release_date)}</span>
              {movie.duration && (
                <>
                  <span className="mx-1">•</span>
                  <span>{formatDuration(movie.duration)}</span>
                </>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.genre_id}
                    className="px-2 py-0.5 bg-gray-800/80 text-gray-300 rounded-full text-xs"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookTickets}
              className="cursor-pointer mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
