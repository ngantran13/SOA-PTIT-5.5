"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieShowtimes from "@/components/MovieShowtimes";

export default function MovieShowtimesPage() {
  const params = useParams();
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
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Movie Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="w-40 sm:w-48 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3 justify-center sm:justify-start">
                {/* Rating */}
                <div className="bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded mr-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.rating?.toFixed(1) || "N/A"}
                </div>

                {/* Release Date */}
                <span className="mr-3">
                  {new Date(movie.release_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>

                <span className="mr-3">•</span>

                {/* Duration */}
                <span className="mr-3">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>

                <span className="mr-3">•</span>

                {/* Genres */}
                <div className="flex flex-wrap">
                  {movie.genres &&
                    movie.genres.map((genre, index) => (
                      <span key={genre.genre_id} className="mr-1">
                        {genre.name}
                        {index < movie.genres.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">{movie.description}</p>
              </div>

              <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                <svg
                  className="w-5 h-5 mr-1"
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
                <span className="font-medium">Book Tickets</span>
              </div>
            </div>
          </div>

          {/* Movie Showtimes */}
          <MovieShowtimes movieId={params.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
