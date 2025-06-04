"use client";

import { useState } from "react";
import {
  useGetDashboardQuery,
  useRespondToOfferMutation,
  useAcceptJoiningLetterMutation,
} from "../../redux/api/workerApiSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Check, X } from "lucide-react";

const WorkerDashboard = () => {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery();
  const [activeTab, setActiveTab] = useState("applied");
  const navigate = useNavigate();

  const [respondToOffer] = useRespondToOfferMutation();
  const [acceptJoiningLetter] = useAcceptJoiningLetterMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching dashboard data</p>;

  const { appliedJobs, offerLetterJobs, joiningLetterJobs, recommendedJobs } =
    data;

  const handleRespondToOffer = async (applicationId, response) => {
    try {
      await respondToOffer({
        applicationId,
        data: { action: response },
      }).unwrap();

      toast.success(
        `Offer ${response === "accept" ? "accepted" : "rejected"} successfully`
      );
      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${response} offer: ${error.data?.message || "Unknown error"}`
      );
    }
  };

  const handleAcceptJoiningLetter = async (applicationId) => {
    try {
      await acceptJoiningLetter(applicationId).unwrap();
      toast.success("Joining letter accepted successfully");
      refetch();
    } catch (error) {
      toast.error(
        `Failed to accept joining letter: ${
          error.data?.message || "Unknown error"
        }`
      );
    }
  };

  const renderStatusBadge = (status) => {
    const baseClass =
      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";

    switch (status) {
      case "pending":
      case "underreview":
        return (
          <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
            Under Review
          </span>
        );
      case "approved":
        return (
          <span className={`${baseClass} bg-green-100 text-green-800`}>
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClass} bg-red-100 text-red-800`}>
            Rejected
          </span>
        );
      case "offerSent":
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-800`}>
            Offer Received
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  const renderAppliedJobsList = (jobs) => (
    <ul className="divide-y divide-gray-200">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <li key={job._id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {job.jobPostId?.title || "No Title"}
                  </p>
                  <div className="ml-2">{renderStatusBadge(job.status)}</div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ₹{job.jobPostId?.payscale || 0}/day
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    📍 {job.jobPostId?.location || "No Location"}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    📅 Applied on {new Date(job.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/job/view/${job.jobPostId._id}`)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Job
                  </button>
                  {/* <button
                    onClick={() => navigate(`/job/application/${job._id}`)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Application
                  </button> */}
                </div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="px-4 py-5 sm:px-6">
          <div className="text-center text-gray-500">
            <p>No jobs in this section yet.</p>
          </div>
        </li>
      )}
    </ul>
  );

  const renderOfferLettersList = (jobs) => (
    <ul className="divide-y divide-gray-200">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <li key={job._id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {job.jobPostId?.title || "No Title"}
                  </p>
                  <div className="ml-2">{renderStatusBadge(job.status)}</div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ₹{job.jobPostId?.payscale || 0}/day
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    📍 {job.jobPostId?.location || "No Location"}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    📅 Applied on {new Date(job.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {job.offerLetter && (
                    <a
                      href={job.offerLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </a>
                    
                  )}
                  <button
                    onClick={() => navigate(`/job/view/${job.jobPostId._id}`)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Job
                  </button>
                  <button
                    onClick={() => handleRespondToOffer(job._id, "accept")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespondToOffer(job._id, "reject")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="px-4 py-5 sm:px-6">
          <div className="text-center text-gray-500">
            <p>No offer letters received yet.</p>
          </div>
        </li>
      )}
    </ul>
  );

  const renderJoiningLettersList = (jobs) => (
    <ul className="divide-y divide-gray-200">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <li key={job._id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {job.jobPostId?.title || "No Title"}
                  </p>
                  <div className="ml-2">{renderStatusBadge(job.status)}</div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ₹{job.jobPostId?.payscale || 0}/day
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    📍 {job.jobPostId?.location || "No Location"}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    📅 Applied on {new Date(job.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {job.joiningLetter && (
                    <a
                      href={job.joiningLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`/job/view/${job.jobPostId._id}`)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Job
                  </button>
                  <button
                    onClick={() => handleAcceptJoiningLetter(job._id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="px-4 py-5 sm:px-6">
          <div className="text-center text-gray-500">
            <p>No joining letters received yet.</p>
          </div>
        </li>
      )}
    </ul>
  );

  const renderRecommendedJobs = () => (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 px-4 sm:px-6">
        Recommended Jobs
      </h3>
      <ul className="divide-y divide-gray-200 mt-2">
        {recommendedJobs && recommendedJobs.length > 0 ? (
          recommendedJobs.map((job) => (
            <li key={job._id} className="hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {job.title || "No Title"}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ₹{job.payscale || 0}/day
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      📍 {job.location || "No Location"}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      🕒 {job.duration || "No Duration"}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                    <button
                      onClick={() => navigate(`/job/view/${job._id}`)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Job
                    </button>
                    <button
                      onClick={() => navigate(`/job/apply/${job._id}`)}
                      className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-4 py-5 sm:px-6">
            <div className="text-center text-gray-500">
              <p>No recommended jobs available.</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="bg-white shadow py-10 mt-10 overflow-hidden sm:rounded-lg max-w-6xl mx-auto">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`w-1/3 py-4 px-1 text-center text-sm font-medium border-b-2 ${
              activeTab === "applied"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("applied")}
          >
            Applied Jobs
          </button>
          <button
            className={`w-1/3 py-4 px-1 text-center text-sm font-medium border-b-2 ${
              activeTab === "offer"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("offer")}
          >
            Offer Letters
          </button>
          <button
            className={`w-1/3 py-4 px-1 text-center text-sm font-medium border-b-2 ${
              activeTab === "joining"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("joining")}
          >
            Joining Letters
          </button>
        </nav>
      </div>
      <div>
        {activeTab === "applied" && renderAppliedJobsList(appliedJobs)}
        {activeTab === "offer" && renderOfferLettersList(offerLetterJobs)}
        {activeTab === "joining" && renderJoiningLettersList(joiningLetterJobs)}
      </div>

      {activeTab === "applied" && renderRecommendedJobs()}
    </div>
  );
};

export default WorkerDashboard;
