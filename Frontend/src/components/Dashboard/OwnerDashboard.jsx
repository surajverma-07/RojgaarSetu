import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetOwnerDashboardQuery } from "../../redux/api/ownerApiSlice";
import { Truck, AlertCircle } from "lucide-react";

const OwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useGetOwnerDashboardQuery();

  const [activeTab, setActiveTab] = useState("pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  const vehicleApplications = data?.vehicleApplications || [];
  const recommendedForms = data?.recommendedForms || [];

  // Categorize applications
  const categorizedApplications = {
    pending: vehicleApplications.filter((app) => app.status === "pending"),
    accepted: vehicleApplications.filter((app) => app.status === "accepted"),
    rejected: vehicleApplications.filter((app) => app.status === "rejected"),
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs for Application Status */}
          <div className="flex space-x-4 mb-6">
            {["pending", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                className={`py-2 px-4 rounded ${
                  activeTab === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Display Applications Based on Active Tab */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            {categorizedApplications[activeTab].length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {categorizedApplications[activeTab].map((app) => (
                  <li key={app._id}>
                    <Link
                      to={`/vehicle/application/${app._id}`}
                      className="block px-4 py-4 sm:px-6 hover:bg-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-blue-600 truncate">
                            {app.vehicleFormId.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {app.type} - {app.brand || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0..."
                              clipRule="evenodd"
                            />
                          </svg>
                          {app.location}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8..."
                              clipRule="evenodd"
                            />
                          </svg>
                          Applied on{" "}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-center text-gray-500">
                <p>No applications in this category.</p>
              </div>
            )}
          </div>

          {/* Recommended Forms */}
          <div className="space-y-4 mt-8">
            <h2 className="text-lg font-medium text-gray-900">
              Recommended Forms
            </h2>
            {recommendedForms.length > 0 ? (
              recommendedForms.map((form) => (
                <div
                  key={form._id}
                  className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {form.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {form.otherDetails}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>🏷️ Brand: {form.brand}</span>
                        <span>📍 {form.location}</span>
                        <span>💰 ₹{form.payscale}/day</span>
                        <span>🔢 Quantity: {form.quantity}</span>
                        <span>
                          📅 {new Date(form.purchaseDate).toLocaleDateString()}
                        </span>
                        <span>🏢 {form.organization}</span>
                        <a
                          href={form.contractorProfileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          👤 {form.contractorId.name}
                        </a>
                      </div>
                    </div>
                    <Link
                      to={`/vehicle/view/${form._id}`}
                      className="ml-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">
                No recommendations at this time.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
