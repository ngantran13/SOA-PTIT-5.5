"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useUser } from "../../context/UserContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
            {/* Profile header */}
            <div className="bg-gray-800 py-6 px-6">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-semibold text-white">
                    {user?.full_name || "User"}
                  </h1>
                  <p className="text-gray-300">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Information
                  </h2>
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    User ID
                  </div>
                  <div className="mt-1 text-gray-800">{user?.id}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="mt-1 text-gray-800">{user?.email}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Account Created
                  </div>
                  <div className="mt-1 text-gray-800">
                    {/* Showing mock data since we don't have actual user creation date */}
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <div className="text-sm font-medium text-gray-500">
                    Account Status
                  </div>
                  <div className="mt-1 text-gray-800">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Activity Summary
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-500 p-3 text-white">
                      <svg
                        className="h-6 w-6"
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
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-500">
                        Total Bookings
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        0
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-500 p-3 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-500">
                        Favorites
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        0
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-500 p-3 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-500">
                        Loyalty Points
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        0
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
