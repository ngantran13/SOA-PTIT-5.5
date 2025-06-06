"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { bookingId } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);

        // Fetch booking data
        const bookingResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking-tickets/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!bookingResponse.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const bookingData = await bookingResponse.json();
        console.log(bookingData);
        setBooking(bookingData);

        const showtimeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/showtimes/${bookingData.showtime_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!showtimeResponse.ok) {
          throw new Error("Failed to fetch showtime details");
        }

        const showtimeData = await showtimeResponse.json();

        setShowtime(showtimeData);

        console.log(showtimeData);

        const movieResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/${showtimeData.movie.movie_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const movieData = await movieResponse.json();
        setMovie(movieData);

        const customerData = localStorage.getItem("user");
        console.log(customerData);
        setCustomer(JSON.parse(customerData));

        // Fetch seats data
        if (bookingData.status !== "canceled") {
          const seatsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/seats/booking/${bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!seatsResponse.ok) {
            throw new Error("Failed to fetch seats details");
          }

          const seatsData = await seatsResponse.json();
          console.log(seatsData);
          setSeats(seatsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    // Format: M/D/YYYY at hh:mm AM/PM
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);

    let month = "",
      day = "",
      year = "",
      hour = "",
      minute = "",
      dayPeriod = "";

    parts.forEach((part) => {
      if (part.type === "month") month = part.value;
      if (part.type === "day") day = part.value;
      if (part.type === "year") year = part.value;
      if (part.type === "hour") hour = part.value;
      if (part.type === "minute") minute = part.value;
      if (part.type === "dayPeriod") dayPeriod = part.value;
    });

    return `${month}/${day}/${year} at ${hour}:${minute} ${dayPeriod}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "canceled":
        return "text-red-600 bg-red-100";
      case "pending":
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const handleCancelBooking = async () => {
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

        if (!response.ok) {
          throw new Error("Failed to cancel booking");
        }

        // Refresh booking data
        window.location.reload();
      } catch (error) {
        console.error("Error canceling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-700 mb-4">{error}</p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking || !movie || !showtime || !customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Not Found
              </h1>
              <p className="text-gray-700 mb-4">
                The booking you're looking for could not be found.
              </p>
              <button
                onClick={() => router.push("/my-bookings")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/my-bookings"
              className="text-red-600 hover:text-red-700 flex items-center"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to My Bookings
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Booking Status Header */}
            <div
              className={`p-4 ${
                booking.status === "completed"
                  ? "bg-green-50"
                  : booking.status === "canceled"
                  ? "bg-red-50"
                  : "bg-yellow-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className={`w-6 h-6 mr-2 ${
                      booking.status === "completed"
                        ? "text-green-600"
                        : booking.status === "canceled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {booking.status === "completed" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    ) : booking.status === "canceled" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                  <h2 className="text-lg font-semibold">
                    Booking #{booking.booking_ticket_id} -
                    {booking.status === "completed"
                      ? " Confirmed"
                      : booking.status === "canceled"
                      ? " Canceled"
                      : " Pending"}
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Movie Poster */}
                <div className="md:w-1/3">
                  <div className="bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="md:w-2/3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {movie.title}
                  </h1>

                  <div className="mt-4 space-y-6">
                    {/* Main Booking Info */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Booking Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Booking ID
                          </span>
                          <span className="font-medium">
                            {booking.booking_ticket_id}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Booking Date
                          </span>
                          <span className="font-medium">
                            {formatDate(booking.booking_date)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Status
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Payment ID
                          </span>
                          <span className="font-medium">
                            {booking.payment_id || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Customer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Name
                          </span>
                          <span className="font-medium">
                            {customer.full_name || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Email
                          </span>
                          <span className="font-medium">
                            {customer.email || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Phone
                          </span>
                          <span className="font-medium">
                            {customer.phone || customer.phone_number || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Showtime Info */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Showtime Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Cinema
                          </span>
                          <span className="font-medium">
                            {showtime.theater + " Cinema"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Date & Time
                          </span>
                          <span className="font-medium">
                            {formatDate(showtime.starttime)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Seats
                          </span>
                          <span className="font-medium">
                            {seats.length > 0
                              ? seats
                                  .map((seat) => `${seat.seat_name}`)
                                  .join(", ")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Payment Information
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Total Amount
                          </span>
                          <span className="text-2xl font-bold text-red-600">
                            {booking.total_amount?.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500 block">
                            Payment Status
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                              booking.status === "completed"
                                ? "text-green-600"
                                : booking.status === "canceled"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {booking.status === "completed"
                              ? "Paid"
                              : booking.status === "canceled"
                              ? "Canceled"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                {booking.status === "pending" && (
                  <button
                    onClick={handleCancelBooking}
                    className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel Booking
                  </button>
                )}

                <Link
                  href={`/movies/${movie.movie_id}`}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Movie
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
