"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie:", error);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [params.id]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBookTickets = () => {
    router.push(`/movies/${params.id}/showtimes`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-10 bg-gray-900 text-white">
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-900 to-transparent z-10"></div>

          <div className="absolute inset-0 bg-gray-900 opacity-90"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="lg:flex">
              <div className="lg:w-1/3 mb-6 lg:mb-0 flex justify-center lg:justify-start">
                <div className="rounded-lg overflow-hidden shadow-xl border-4 border-gray-800 h-[450px] w-[300px]">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:w-2/3 lg:pl-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center text-sm text-gray-300 mb-4">
                  <div className="bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded mr-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.rating.toFixed(1)}
                  </div>
                  <span className="mr-3">{formatDate(movie.release_date)}</span>
                  <span className="mr-3">•</span>
                  <span className="mr-3">{formatDuration(movie.duration)}</span>
                  <span className="mr-3">•</span>
                  <div className="flex flex-wrap">
                    {movie.genres.map((genre, index) => (
                      <span key={genre.genre_id} className="mr-1">
                        {genre.name}
                        {index < movie.genres.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleBookTickets}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 inline-flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Movie Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Information
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-600 w-32">Title:</span>
                  <span className="text-gray-900 font-medium">
                    {movie.title}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Release Date:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(movie.release_date)}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Duration:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDuration(movie.duration)}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Rating:</span>
                  <span className="text-gray-900 font-medium">
                    {movie.rating.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.genre_id}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Synopsis
            </h3>
            <p className="text-gray-700 leading-relaxed">{movie.description}</p>
          </div>

          {/* Showtimes Link */}
          <div className="mt-8 flex justify-center">
            <Link
              href={`/movies/${params.id}/showtimes`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View All Showtimes
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
