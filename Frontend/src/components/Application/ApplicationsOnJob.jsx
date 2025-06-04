import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetJobApplicationsQuery } from '@/redux/api/contractorApiSlice';

function ApplicationsOnJob() {
  const { jobId } = useParams(); // Get the job ID from URL params
  const { data: jobApplications, isLoading, error } = useGetJobApplicationsQuery(jobId); // Fetch job applications

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Applications for Job: {jobApplications.jobPost.title}</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Location:</p>
                <p className="text-gray-700">{jobApplications.jobPost.location}</p>
              </div>
              <div>
                <p className="font-medium">Payscale:</p>
                <p className="text-gray-700">₹{jobApplications.jobPost.payscale}/day</p>
              </div>
              <div>
                <p className="font-medium">Duration:</p>
                <p className="text-gray-700">{jobApplications.jobPost.duration}</p>
              </div>
              <div>
                <p className="font-medium">Required Skills:</p>
                <p className="text-gray-700">{jobApplications.jobPost.requiredSkill}</p>
              </div>
              <div>
                <p className="font-medium">Experience Required:</p>
                <p className="text-gray-700">{jobApplications.jobPost.experienceRequired} years</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Applications</h2>
          {jobApplications.applications.length > 0 ? (
            jobApplications.applications.map((application) => (
              <div key={application._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">{application.name}</h3>
                <p className="text-gray-600"><strong>Status:</strong> {application.status}</p>
                <p className="text-gray-600"><strong>Experience:</strong> {application.experience} years</p>
                <p className="text-gray-600"><strong>Email:</strong> {application.email}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {application.phone}</p>
                <p className="text-gray-600"><strong>Profile Link:</strong> <a href={application.profileLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Profile</a></p>
                <Link to={`/job/application/${application._id}`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                  View Application
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p>No applications yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ApplicationsOnJob;