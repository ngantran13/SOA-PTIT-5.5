"use client";

import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import MovieList from "../components/MovieList";
import Header from "../components/Header";

export default function HomePage() {
  const [movies, setMovies] = useState([]);

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
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pt-20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MovieList title="Recent Releases" movies={movies.slice(0, 4)} />
          <MovieList title="Top Rated Movies" movies={movies.slice(4, 9)} />
        </div>
        <Footer />
      </main>
    </div>
  );
}
