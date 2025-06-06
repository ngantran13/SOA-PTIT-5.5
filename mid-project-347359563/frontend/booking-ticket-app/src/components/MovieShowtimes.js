"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { cinemas } from "@/data/cinema";

const MovieShowtimes = ({ movieId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showtimes, setShowtimes] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [cinemasWithShowtimes, setCinemasWithShowtimes] = useState([]);

  useEffect(() => {
    const generateDates = () => {
      const dateArray = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateArray.push({
          date: date,
          dateString: date.toISOString().split("T")[0],
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString("en-US", { month: "short" }),
        });
      }

      setDates(dateArray);
      setSelectedDate(dateArray[0].dateString);
    };

    generateDates();
  }, []);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/showtimes/movie/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setShowtimes(data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      const cinemasWithShowtimes = cinemas.map((cinema) => {
        const filteredShowtimes = showtimes.filter(
          (showtime) => showtime.theater === cinema.theater
        );
        cinema.showtimes = filteredShowtimes;
        return cinema;
      });

      console.log(cinemasWithShowtimes);

      setCinemasWithShowtimes(cinemasWithShowtimes);
      setLoading(false);
    }
  }, [showtimes]);

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
  };

  const handleShowtimeSelect = (cinemaId, showtimeId) => {
    router.push(
      `/movies/${movieId}/showtimes/${showtimeId}/seats?cinema=${cinemaId}`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Showtimes</h2>

      {/* Date Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Select Date
        </h3>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {dates.map((dateItem) => (
            <button
              key={dateItem.dateString}
              onClick={() => handleDateSelect(dateItem.dateString)}
              className={`flex flex-col items-center py-2 px-1 rounded-lg border ${
                selectedDate === dateItem.dateString
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              } transition-colors duration-200`}
            >
              <span className="text-xs font-medium">{dateItem.dayName}</span>
              <span className="text-lg font-bold">{dateItem.dayNumber}</span>
              <span className="text-xs">{dateItem.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cinema and Showtimes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Cinemas
        </h3>

        {cinemasWithShowtimes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No showtimes available for the selected date.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {cinemasWithShowtimes.map((cinema) => (
              <div
                key={cinema.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">{cinema.name}</h4>
                  <p className="text-sm text-gray-600">{cinema.location}</p>
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {cinema.showtimes.map((showtime) => (
                      <button
                        key={showtime.showtime_id}
                        onClick={() =>
                          handleShowtimeSelect(cinema.id, showtime.showtime_id)
                        }
                        className="cursor-pointer flex flex-col items-center px-4 py-2 border border-gray-300 rounded-md hover:border-red-500 hover:bg-red-50 transition-colors duration-200"
                      >
                        <span className="font-medium text-gray-900">
                          {new Date(showtime.starttime).getHours()}:
                          {new Date(showtime.starttime)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}
                        </span>
                        <span className="text-xs text-gray-600">
                          {showtime.price.toLocaleString("vi-VN")} vnđ
                        </span>
                        <span className="text-xs text-gray-500">50 seats</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieShowtimes;
