"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MovieCard from "../../components/MovieCard";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/movies`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);

        // Mock data in case API fails
        const mockMovies = [
          {
            title: "The Dark Knight",
            description:
              "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            release_date: "2008-07-18T00:00:00",
            duration: 152,
            rating: 9.0,
            poster_url:
              "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            movie_id: 1,
            created_at: "2025-05-04T15:11:21",
            updated_at: "2025-05-04T15:11:21",
            genres: [
              {
                name: "Crime",
                genre_id: 4,
              },
              {
                name: "Action",
                genre_id: 7,
              },
              {
                name: "Drama",
                genre_id: 10,
              },
            ],
          },
          {
            title: "Inception",
            description:
              "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            release_date: "2010-07-16T00:00:00",
            duration: 148,
            rating: 8.8,
            poster_url:
              "https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
            movie_id: 2,
            created_at: "2025-05-04T15:11:21",
            updated_at: "2025-05-04T15:11:21",
            genres: [
              {
                name: "Science Fiction",
                genre_id: 1,
              },
              {
                name: "Action",
                genre_id: 7,
              },
              {
                name: "Thriller",
                genre_id: 9,
              },
            ],
          },
          {
            title: "Pulp Fiction",
            description:
              "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            release_date: "1994-10-14T00:00:00",
            duration: 154,
            rating: 8.9,
            poster_url:
              "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            movie_id: 3,
            created_at: "2025-05-04T15:11:21",
            updated_at: "2025-05-04T15:11:21",
            genres: [
              {
                name: "Crime",
                genre_id: 4,
              },
              {
                name: "Drama",
                genre_id: 10,
              },
              {
                name: "Thriller",
                genre_id: 9,
              },
            ],
          },
          {
            title: "The Shawshank Redemption",
            description:
              "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            release_date: "1994-10-14T00:00:00",
            duration: 142,
            rating: 9.3,
            poster_url:
              "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            movie_id: 4,
            created_at: "2025-05-04T15:11:21",
            updated_at: "2025-05-04T15:11:21",
            genres: [
              {
                name: "Drama",
                genre_id: 10,
              },
              {
                name: "Crime",
                genre_id: 4,
              },
            ],
          },
        ];
        setMovies(mockMovies);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Movies</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
