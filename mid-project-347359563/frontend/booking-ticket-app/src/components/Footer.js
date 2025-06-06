import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Movie Booking</h3>
            <p className="text-gray-400">
              The best place to book movie tickets online.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-white">
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="text-gray-400 hover:text-white"
                >
                  Booking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@moviebooking.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Movie St, Cinema City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Movie Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
