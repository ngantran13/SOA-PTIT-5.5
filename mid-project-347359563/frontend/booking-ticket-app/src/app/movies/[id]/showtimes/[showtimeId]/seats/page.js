"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cinemas } from "@/data/cinema";

export default function SeatSelectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const cinemaId = searchParams.get("cinema");
  const movieId = params.id;
  const showtimeId = params.showtimeId;

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [cinema, setCinema] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviePromise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((res) => res.json());

        const showtimePromise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/showtimes/${showtimeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((res) => res.json());

        const seatsPromise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seat-status/showtime/${showtimeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((res) => res.json());

        const [movieData, showtimeData, seatsData] = await Promise.all([
          moviePromise,
          showtimePromise,
          seatsPromise,
        ]);

        console.log("Movie data:", movieData);
        console.log("Showtime data:", showtimeData);
        console.log("Seats data:", seatsData);

        const foundCinema = cinemas.find((c) => c.id === parseInt(cinemaId));

        const processedSeats = seatsData.map((seat, index) => {
          const rowIndex = Math.floor(index / 5);
          const row = String.fromCharCode(65 + rowIndex);

          const number = (index % 5) + 1;

          return {
            ...seat,
            row: row,
            number: number,
          };
        });

        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setCustomerInfo({
            id: user.id,
            full_name: "",
            email: "",
            phone_number: "",
          });
        }

        setMovie(movieData);
        setCinema(foundCinema);
        setShowtime(showtimeData);
        setSeats(processedSeats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, cinemaId, showtimeId]);

  const toggleSeatSelection = (seat) => {
    if (seat.status !== "available") {
      return;
    }

    if (selectedSeats.includes(seat.seat_status_id)) {
      setSelectedSeats(
        selectedSeats.filter((id) => id !== seat.seat_status_id)
      );
    } else {
      setSelectedSeats([...selectedSeats, seat.seat_status_id]);
    }
  };

  const calculateTotal = () => {
    if (!showtime) return 0;

    const basePrice = showtime.price || 0;

    const seatsPrice = selectedSeats.reduce((total, seatId) => {
      const seat = seats.find((s) => s.seat_status_id === seatId);
      return total + (seat ? seat.price : 0);
    }, 0);

    return basePrice + seatsPrice;
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    setShowCustomerForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !customerInfo.full_name ||
      !customerInfo.email ||
      !customerInfo.phone_number
    ) {
      alert("Please fill in all fields");
      return;
    }
    const totalPrice = calculateTotal();

    const bookingData = {
      customer_id: customerInfo.id,
      showtime_id: parseInt(showtimeId),
      total_amount: totalPrice,
      seat_status_ids: selectedSeats,
    };

    console.log("Booking data:", bookingData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking-tickets/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();
      console.log("Booking created:", data);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/pay/place?booking_ticket_id=${data.booking_ticket_id}&customer_id=${customerInfo.id}&full_name=${customerInfo.full_name}&email=${customerInfo.email}&amount=${totalPrice}`;
      router.push(url);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  // Group seats by row for display
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Booking Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Select Seats
            </h1>
            <div className="flex items-center">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-md shadow-sm mr-4"
              />
              <div>
                <h2 className="font-semibold text-xl text-gray-900">
                  {movie.title}
                </h2>
                <p className="text-gray-600">
                  {cinema.name} •{" "}
                  {new Date(showtime.starttime).toLocaleDateString()} •{" "}
                  {new Date(showtime.starttime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Screen indicator */}
            <div className="mb-10">
              <div className="h-2 bg-gray-300 rounded-lg w-full mb-1"></div>
              <div className="h-8 bg-gradient-to-b from-gray-300 to-transparent w-full mb-2 rounded-b-lg opacity-50"></div>
              <p className="text-center text-gray-500 text-sm">SCREEN</p>
            </div>

            {/* Seat map */}
            <div className="mb-8">
              {Object.keys(seatsByRow)
                .sort()
                .map((row) => {
                  // Determine seat type based on row
                  let seatType = "";
                  let seatTypeClass = "";

                  if (["A", "B", "C"].includes(row)) {
                    seatType = "Normal";
                    seatTypeClass = "bg-gray-100 border-gray-300";
                  } else if (["D", "E"].includes(row)) {
                    seatType = "VIP";
                    seatTypeClass = "bg-blue-50 border-blue-300";
                  } else if (row === "F") {
                    seatType = "Premium";
                    seatTypeClass = "bg-purple-50 border-purple-300";
                  }

                  return (
                    <div key={row} className="flex justify-center mb-3">
                      <div className="w-12 flex items-center justify-center text-gray-500 font-medium">
                        <span
                          className={`px-2 py-1 rounded text-xs ${seatTypeClass} border`}
                        >
                          {row}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {seatsByRow[row]
                          .sort((a, b) => a.number - b.number)
                          .map((seat) => (
                            <button
                              key={seat.seat_status_id}
                              onClick={() => toggleSeatSelection(seat)}
                              disabled={seat.status !== "available"}
                              className={`cursor-pointer
                            w-10 h-10 flex items-center justify-center rounded-t-lg text-sm font-medium
                            transition-colors duration-200
                            ${
                              seat.status === "booked"
                                ? "bg-blue-900 text-gray-500 cursor-not-allowed"
                                : ""
                            }
                            ${
                              seat.status === "reserved"
                                ? "bg-yellow-200 text-yellow-800 cursor-not-allowed"
                                : ""
                            }
                            ${
                              seat.status === "available" &&
                              !selectedSeats.includes(seat.seat_status_id)
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : ""
                            }
                            ${
                              selectedSeats.includes(seat.seat_status_id)
                                ? "bg-red-500 text-white"
                                : ""
                            }
                          `}
                            >
                              {seat.number}
                            </button>
                          ))}
                      </div>
                      <div className="ml-2 w-12 flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          {seatType}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-100 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-yellow-200 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Reserved</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-blue-900 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Movie:</span>
                <span className="font-medium">{movie.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price for movie:</span>
                <span className="font-medium">
                  {showtime.price.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cinema:</span>
                <span className="font-medium">{cinema.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {new Date(showtime.starttime).toLocaleDateString()} at{" "}
                  {new Date(showtime.starttime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Seats:</span>
                <span className="font-medium">
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .map((id) => {
                          const seat = seats.find((s) => s.seat_status === id);
                          return seat ? `${seat.row}${seat.number}` : id;
                        })
                        .join(", ")
                    : "None"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price for Seats:</span>
                <span className="font-medium">
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .reduce((total, seatId) => {
                          const seat = seats.find(
                            (s) => s.seat_status_id === seatId
                          );
                          return total + (seat ? seat.price : showtime.price);
                        }, 0)
                        .toLocaleString("vi-VN")
                    : "0"}
                  đ
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Total:</span>
                <span className="text-red-600 font-bold text-xl">
                  {calculateTotal().toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className={`cursor-pointer w-full py-3 px-4 rounded-md font-medium text-white
                flex items-center justify-center
                ${
                  selectedSeats.length > 0
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
                transition-colors duration-200`}
            >
              {selectedSeats.length > 0 ? "Book" : "Please Select Seats"}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Information Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Customer Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Information pre-filled from your account
            </p>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={customerInfo.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={customerInfo.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
