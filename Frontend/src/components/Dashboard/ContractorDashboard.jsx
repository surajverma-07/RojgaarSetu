"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useGetDashboardQuery,
  useProcessJobApplicationMutation,
  useProcessVehicleApplicationMutation,
  useSendJoiningLetterMutation,
} from "@/redux/api/contractorApiSlice";
import { toast } from "react-hot-toast";

const ContractorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeView, setActiveView] = useState("jobs");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { data, isSuccess } = useGetDashboardQuery();
  const [processJobApplication] = useProcessJobApplicationMutation();
  const [processVehicleApplication] = useProcessVehicleApplicationMutation();
  const [sendJoiningLetter] = useSendJoiningLetterMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSuccess) setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSuccess, data]);

  const handleJobAction = async (applicationId, action) => {
    try {
      const feedback = ""; // You can modify this to collect feedback if needed
      await processJobApplication({
        applicationId,
        data: { action, feedback },
      }).unwrap();
      toast.success(`Application ${action} successfully!`); // Show success toast
      // Optionally, you can refetch the dashboard data here to update the UI
    } catch (err) {
      console.error("Error processing application:", err);
      toast.error(
        "An error occurred while processing the application. Please try again."
      ); // Show error toast
    }
  };
  const handleJobAction1 = async (applicationId) => {
    try {
      await sendJoiningLetter({ applicationId }).unwrap();
      toast.success("Joining letter sent successfully!");
      // Optionally, refetch dashboard or applications
    } catch (err) {
      console.error("Error processing application:", err);
      toast.error("An error occurred while sending the joining letter.");
    }
  };

  const handleVehicleAction = async (applicationId, action) => {
    try {
      const feedback = ""; // You can modify this to collect feedback if needed
      await processVehicleApplication({
        applicationId,
        data: { action, feedback },
      }).unwrap();
      toast.success(`Vehicle application ${action} successfully!`); // Show success toast
      // Optionally, you can refetch the dashboard data here to update the UI
    } catch (err) {
      console.error("Error processing vehicle application:", err);
      toast.error(
        "An error occurred while processing the vehicle application. Please try again."
      ); // Show error toast
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Extract data from the dashboard response
  const jobPosts = dashboardData?.jobPosts || [];
  const vehicleForms = dashboardData?.vehicleForms || [];
  const jobApplications = dashboardData?.jobApplications || {
    appliedCandidates: [],
    offerLetterSent: [],
    joiningLetterSent: [],
    joinedCandidates: [],
  };
  const vehicleApplications = dashboardData?.vehicleApplications || [];

  // Calculate job stats
  const totalJobApplications = jobApplications.appliedCandidates?.length || 0;
  const offersSent = jobApplications.offerLetterSent?.length || 0;
  const acceptedOffers = jobApplications.joiningLetterSent?.length || 0;
  const joinedCandidates = jobApplications.joinedCandidates?.length || 0;
  const pendingJobReview =
    jobApplications.appliedCandidates?.filter(
      (app) => app.status === "underreview"
    )?.length || 0;

  // Calculate vehicle stats
  const totalVehicleApplications = vehicleApplications?.length || 0;
  const acceptedVehicles =
    vehicleApplications?.filter((app) => app.status === "accepted")?.length ||
    0;
  const pendingVehicleReview =
    vehicleApplications?.filter((app) => app.status === "pending")?.length || 0;
  const rejectedVehicles =
    vehicleApplications?.filter((app) => app.status === "rejected")?.length ||
    0;

  // Calculate combined stats
  const totalApplications = totalJobApplications + totalVehicleApplications;

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Applications
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {totalApplications || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Offers Sent
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {offersSent || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Accepted Offers
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {acceptedOffers || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Review
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {activeView === "jobs"
                            ? pendingJobReview
                            : pendingVehicleReview}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle View */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`${
                  activeView === "jobs"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => setActiveView("jobs")}
              >
                Job Postings
              </button>
              <button
                type="button"
                className={`${
                  activeView === "vehicles"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => setActiveView("vehicles")}
              >
                Vehicle/Instrument Forms
              </button>
            </div>
          </div>

          {/* Content based on active view */}
          <div className="mt-6">
            {activeView === "jobs" ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Job Postings
                  </h2>
                  <Link
                    to="/job/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Job
                  </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {jobPosts && jobPosts.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {jobPosts.map((job) => (
                        <li key={job._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-blue-600 truncate">
                                  {job.title}
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                  {job.applications.length} applications
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <Link
                                  to={`/job/view/${job._id}`}
                                  className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  View Job
                                </Link>
                                <Link
                                  to={`/job/applications/${job._id}`}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  View Applications
                                </Link>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {job.location}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  ₹{job.payscale}/day
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>
                                  Posted on{" "}
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                      <p>You haven't posted any jobs yet.</p>
                      <Link
                        to="/job/create"
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Create Your First Job
                      </Link>
                    </div>
                  )}
                </div>

                {/* Applied Candidates Section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Applied Candidates
                  </h2>

                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {jobApplications.appliedCandidates &&
                    jobApplications.appliedCandidates.length > 0 ? (
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Candidate
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Job
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Status
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Applied On
                                      </th>
                                      <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                      >
                                        <span className="sr-only">Actions</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {jobApplications.appliedCandidates.map(
                                      (application) => (
                                        <tr key={application._id}>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500 font-medium">
                                                  {application.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                                </span>
                                              </div>
                                              <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                  {application.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                  {application.email}
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                              {jobPosts.find(
                                                (job) =>
                                                  job._id ===
                                                  application.jobPostId
                                              )?.title || "Unknown Job"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                              {application.status ===
                                              "underreview"
                                                ? "Under Review"
                                                : application.status}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                              application.appliedAt
                                            ).toLocaleDateString()}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                              to={`/job/application/${application._id}`}
                                              className="text-blue-600 hover:text-blue-900 mr-2"
                                            >
                                              View Application
                                            </Link>

                                            <button
                                              className="text-green-600 hover:text-green-900 mr-2"
                                              onClick={() =>
                                                handleJobAction(
                                                  application._id,
                                                  "sendOffer"
                                                )
                                              }
                                            >
                                              Send Offer
                                            </button>
                                            <button
                                              className="text-red-600 hover:text-red-900"
                                              onClick={() =>
                                                handleJobAction(
                                                  application._id,
                                                  "reject"
                                                )
                                              }
                                            >
                                              Reject
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                        <p>No candidates have applied to your jobs yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Offer Letters Section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Offer Letters Sent
                  </h2>

                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {jobApplications.offerLetterSent &&
                    jobApplications.offerLetterSent.length > 0 ? (
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Candidate
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Position
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Status
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Sent Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                      >
                                        <span className="sr-only">Actions</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {jobApplications.offerLetterSent.map(
                                      (offer) => (
                                        <tr key={offer._id}>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500 font-medium">
                                                  {offer.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                                </span>
                                              </div>
                                              <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                  {offer.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                  {offer.email}
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                              {jobPosts.find(
                                                (job) =>
                                                  job._id === offer.jobPostId
                                              )?.title || "Unknown Job"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                              Offer Sent
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                              offer.appliedAt
                                            ).toLocaleDateString()}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-2">
                                              <a
                                                href={offer?.offerLetter}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-900 mr-2"
                                              >
                                                Download Offer
                                              </a>
                                            </button>
                                            <button
                                              className="text-indigo-600 hover:text-indigo-900"
                                              onClick={() =>
                                                handleJobAction1(offer._id)
                                              }
                                            >
                                              Send Joining Letter
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                        <p>You haven't sent any offer letters yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Joined Candidates */}
                <div className="mt-8">
  <h2 className="text-lg font-medium text-gray-900 mb-4">Joined Candidates</h2>

  <div className="bg-white shadow overflow-hidden sm:rounded-md">
    {jobApplications.joinedCandidates && jobApplications.joinedCandidates.length > 0 ? (
      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Candidate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Joined Date
                      </th>
                      <th
                        scope="col"
                        className="relative px-6 py-3"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobApplications.joinedCandidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {candidate.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-500">{candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {jobPosts.find((job) => job._id === candidate.jobPostId)?.title || "Unknown Job"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Joined
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(candidate.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={candidate?.joiningLetter}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                          >
                            Download Joining Letter
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
        <p>No candidates have joined yet.</p>
      </div>
    )}
  </div>
</div>



              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Vehicle/Instrument Forms
                  </h2>
                  <Link
                    to="/vehicle/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Form
                  </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {vehicleForms && vehicleForms.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {vehicleForms.map((form) => (
                        <li key={form._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-blue-600 truncate">
                                  {form.title}
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                  {form.applications.length} applications
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <Link
                                  to={`/vehicle/view/${form._id}`}
                                  className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  View Form
                                </Link>
                                <Link
                                  to={`/vehicle/applications/${form._id}`}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  View Applications
                                </Link>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {form.location}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  ₹{form.payscale}/day
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>
                                  Posted on{" "}
                                  {new Date(
                                    form.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                      <p>
                        You haven't posted any vehicle/instrument forms yet.
                      </p>
                      <Link
                        to="/vehicle/create"
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Create Your First Form
                      </Link>
                    </div>
                  )}
                </div>

                {/* Vehicle Applications Section */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Vehicle Applications
                  </h2>

                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {vehicleApplications && vehicleApplications.length > 0 ? (
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col">
                          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Applicant
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Vehicle Type
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Status
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Application Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                      >
                                        <span className="sr-only">Actions</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {vehicleApplications.map((application) => (
                                      <tr key={application._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                              <span className="text-gray-500 font-medium">
                                                {application.applicantId.name
                                                  .charAt(0)
                                                  .toUpperCase()}
                                              </span>
                                            </div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">
                                                {application.applicantId.name}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {application.applicantId.email}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">
                                            {application.type}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {application.brand}{" "}
                                            {application.model}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              application.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : application.status ===
                                                  "accepted"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                          >
                                            {application.status
                                              .charAt(0)
                                              .toUpperCase() +
                                              application.status.slice(1)}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {new Date(
                                            application.appliedAt
                                          ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          <Link
                                            to={`/vehicle/application/${application._id}`}
                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                          >
                                            View Application
                                          </Link>
                                          {application.status === "pending" && (
                                            <>
                                              <button
                                                className="text-green-600 hover:text-green-900 mr-2"
                                                onClick={() =>
                                                  handleVehicleAction(
                                                    application._id,
                                                    "accept"
                                                  )
                                                }
                                              >
                                                Accept
                                              </button>
                                              <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() =>
                                                  handleVehicleAction(
                                                    application._id,
                                                    "reject"
                                                  )
                                                }
                                              >
                                                Reject
                                              </button>
                                            </>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                        <p>No vehicle applications received yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Application Stats */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Applications
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {totalVehicleApplications}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Accepted
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {acceptedVehicles}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Rejected
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {rejectedVehicles}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractorDashboard;
