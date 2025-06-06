"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useUser } from "../../context/UserContext";

export default function MyBookingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking-tickets/customer/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setBookings(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const filteredBookings = bookings;

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleCancelBooking = async (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking-tickets/${bookingId}/cancel`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setBookings(
          bookings.map((booking) =>
            booking.booking_ticket_id === bookingId
              ? { ...booking, status: "canceled" }
              : booking
          )
        );
      } catch (error) {
        console.error("Error canceling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  if (isLoading) {
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Bookings list */}
          {filteredBookings && filteredBookings.length === 0 ? (
            <div className="bg-white p-8 rounded-md shadow-sm text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
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
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No bookings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any movie bookings.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Browse Movies
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings &&
                filteredBookings.map((booking) => (
                  <div
                    key={booking.booking_ticket_id}
                    className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:flex-shrink-0 w-full md:w-48">
                        {booking.movie && booking.movie.poster_url ? (
                          <img
                            className="h-48 w-full md:h-full object-cover"
                            src={booking.movie.poster_url}
                            alt={booking.movie.title}
                          />
                        ) : (
                          <div className="h-48 w-full md:h-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">
                            {`Booking ${booking.booking_ticket_id}`}
                          </h2>
                          <div>
                            {booking.status === "pending" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            ) : booking.status === "completed" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Canceled
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500">
                              Booking ID
                            </div>
                            <div className="mt-1 text-gray-900">
                              #{booking.booking_ticket_id}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">
                              Booking Date
                            </div>
                            <div className="mt-1 text-gray-900">
                              {formatDate(booking.booking_date)}
                            </div>
                          </div>
                          {booking.showtime && (
                            <>
                              <div>
                                <div className="text-sm font-medium text-gray-500">
                                  Showtime
                                </div>
                                <div className="mt-1 text-gray-900">
                                  {formatDate(booking.showtime.starttime)} at{" "}
                                  {formatTime(booking.showtime.starttime)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500">
                                  Cinema
                                </div>
                                <div className="mt-1 text-gray-900">
                                  {booking.showtime.cinema_name || "Cinema"}
                                </div>
                              </div>
                            </>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-500">
                              Total Amount
                            </div>
                            <div className="mt-1 text-gray-900 font-medium">
                              {booking.total_amount?.toLocaleString("vi-VN")}đ
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href={`/my-bookings/${booking.booking_ticket_id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            View Details
                          </Link>

                          {booking.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCancelBooking(booking.booking_ticket_id)
                              }
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Cancel Booking
                            </button>
                          )}

                          {booking.status === "COMPLETED" && booking.movie && (
                            <Link
                              href={`/movies/${booking.movie.id}/review?booking=${booking.booking_ticket_id}`}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              Write Review
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
