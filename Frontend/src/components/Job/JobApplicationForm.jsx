import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  useApplyForJobMutation,
} from '../../redux/api/workerApiSlice';
import { useGetProfileQuery } from '@/redux/api/profileApiSlice';
import { useGetJobByIdQuery } from '@/redux/api/jobsApiSlice';
import { AlertCircle, Briefcase } from 'lucide-react';

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const { id: jobPostId } = useParams();
  
  // RTK Query hooks
  const { data: jobData, isLoading: jobLoading, isError: jobError } = useGetJobByIdQuery(jobPostId);
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
  const [applyForJob, { isLoading: isSubmitting }] = useApplyForJobMutation();

  const [formData, setFormData] = useState({
    experience: '',
    availability: ''
  });

  const [errors, setErrors] = useState({
    experience: '',
    availability: ''
  });

  // Pre-fill experience from profile
  useEffect(() => {
    if (profileData?.profile) {
      setFormData(prev => ({
        ...prev,
        experience: profileData.profile.pastExperience?.toString() || '',
        availability: prev.availability // Preserve existing availability if any
      }));
    }
  }, [profileData]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      experience: '',
      availability: ''
    };

    // Experience validation
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
      isValid = false;
    } else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
      newErrors.experience = 'Please enter a valid number of years';
      isValid = false;
    }

    // Availability validation
    if (!formData.availability.trim()) {
      newErrors.availability = 'Availability is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await applyForJob({ 
        jobPostId,
        data: formData
      }).unwrap();
      
      
      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        ...(err.data?.errors || { general: err.data?.message || 'Error submitting application' })
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const isLoading = jobLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
            <p>Job not found or has been removed.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const job = jobData?.jobPost;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          {/* Job Header */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
            <p className="mt-2 text-sm text-gray-600">
              Please fill in the required details to submit your application
            </p>
          </div>

          {/* Job Details */}
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                <span>{job.requiredSkill}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>₹{job.payscale}/day</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={onSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            {/* Error Display */}
            {(errors.general || errors.availability || errors.experience) && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    {errors.general && <p className="text-sm text-red-700">{errors.general}</p>}
                    {errors.experience && <p className="text-sm text-red-700 mt-1">{errors.experience}</p>}
                    {errors.availability && <p className="text-sm text-red-700 mt-1">{errors.availability}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Field */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Relevant Experience (years)
                <span className="text-red-500"> *</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="experience"
                  id="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`block w-full pr-10 sm:text-sm rounded-md ${
                    errors.experience ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter years of experience"
                />
                {errors.experience && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Availability Field */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
                <span className="text-red-500"> *</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="availability"
                  id="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g. Immediate, Available from next Monday"
                  className={`block w-full pr-10 sm:text-sm rounded-md ${
                    errors.availability ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {errors.availability && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red- 500" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;