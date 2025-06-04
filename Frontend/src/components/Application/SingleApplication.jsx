import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProcessJobApplicationMutation, useGetSingleApplicationQuery } from '@/redux/api/contractorApiSlice';
import { toast } from 'react-hot-toast';

function SingleApplication() {
  const { applicationId } = useParams(); // Get applicationId from URL params
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetSingleApplicationQuery(applicationId); // Fetch application details
  const application = data?.application || {}; // Destructure application data from the response
  
  const [processJobApplication] = useProcessJobApplicationMutation(); // Mutation to process the application
  const [feedback, setFeedback] = useState(""); // Manage feedback for rejection

  const handleAction = async (action) => {
    try {
      // Ensure action is provided
      if (!action) {
        console.error("Action is required");
        return;
      }
      
      // Prepare the data object
      const data = { action, feedback };
  
      await processJobApplication({ applicationId, data }).unwrap();
      toast.success(`Application ${action} successfully!`); // Show success toast
      // Redirect back to the applications page after processing
      navigate(`/job/applications`);
    } catch (err) {
      console.error("Error processing application:", err);
      toast.error("An error occurred while processing the application. Please try again."); // Show error toast
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      <p className="text-gray-700"><strong>Name:</strong> {application.name}</p>
      <p className="text-gray-700"><strong>Experience:</strong> {application.experience} years</p>
      <p className="text-gray-700"><strong>Email:</strong> {application.email}</p>
      <p className="text-gray-700"><strong>Status:</strong> {application.status}</p>
      <p className="text-gray-700"><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
      <p className="text-gray-700"><strong>Profile Link:</strong> <a href={application.profileLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Profile</a></p>

      {/* Feedback section for rejection */}
      {application.status === 'rejected' && (
        <div className="mt-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback for rejection"
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        {application.status === 'underreview' && (
          <button onClick={() => handleAction('consider')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Consider</button>
        )}
        {application.status !== 'rejected' && (
          <button onClick={() => handleAction('reject')} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">Reject</button>
        )}
        {application.status === 'underreview' && (
          <button onClick={() => handleAction('sendOffer')} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">Send Offer</button>
        )}
      </div>
    </div>
  );
}

export default SingleApplication;