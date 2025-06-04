import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  useUpdateJobMutation,
  useDeleteJobMutation,
} from '@/redux/api/contractorApiSlice';
import { useGetJobByIdQuery } from '../../redux/api/jobsApiSlice';
import Layout from '../Layout/Layout';

const SingleJobPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userType } = useSelector((state) => state.auth);
  const { data: jobData, isLoading, isError } = useGetJobByIdQuery(id);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    payscale: '',
    requiredSkill: '',
    experienceRequired: '',
    noOfWorkers: '',
    duration: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (jobData?.jobPost) {
      const j = jobData.jobPost;
      setFormData({
        title: j.title || '',
        payscale: j.payscale || '',
        requiredSkill: j.requiredSkill || '',
        experienceRequired: j.experienceRequired || '',
        noOfWorkers: j.noOfWorkers || '',
        duration: j.duration || '',
        location: j.location || '',
        description: j.description || '',
      });
    }
  }, [jobData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (jobData?.jobPost) {
      const j = jobData.jobPost;
      setFormData({
        title: j.title,
        payscale: j.payscale,
        requiredSkill: j.requiredSkill,
        experienceRequired: j.experienceRequired,
        noOfWorkers: j.noOfWorkers,
        duration: j.duration,
        location: j.location,
        description: j.description,
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateJob({ id, ...formData }).unwrap();
      toast.success('Job post updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed. Please try again.');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteJob(id).unwrap();
      toast.success('Job post deleted successfully!');
      navigate('/contractor/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || 'Deletion failed. Please try again.');
    }
  };

  const renderActionButtons = () => {
    if (!isEditing) {
      return (
        <div className="space-x-2">
          {userType === 'Contractor' ? (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </>
          ) : userType === 'Worker' ? (
            <Link
              to={`/job/apply/${id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Apply Now
            </Link>
          ) : null}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !jobData?.jobPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
            <p>Job post not found or unauthorized.</p>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-500 mt-4 inline-block"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const job = jobData.jobPost;

  return (
    <Layout>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this job post?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.section
        className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-black">Job Details</h2>
            {renderActionButtons()}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-black font-bold mb-2">
                  Job Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label htmlFor="payscale" className="block text-black font-bold mb-2">
                  Payscale (₹/day)
                </label>
                <input
                  id="payscale"
                  name="payscale"
                  type="number"
                  required
                  value={formData.payscale}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label htmlFor="requiredSkill" className="block text-black font-bold mb-2">
                  Required Skill
                </label>
                <input
                  id="requiredSkill"
                  name="requiredSkill"
                  type="text"
                  required
                  value={formData.requiredSkill}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experienceRequired" className="block text-black font-bold mb-2">
                    Experience Required (years)
                  </label>
                  <input
                    id="experienceRequired"
                    name="experienceRequired"
                    type="number"
                    required
                    value={formData.experienceRequired}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="noOfWorkers" className="block text-black font-bold mb-2">
                    No. of Workers
                  </label>
                  <input
                    id="noOfWorkers"
                    name="noOfWorkers"
                    type="number"
                    required
                    value={formData.noOfWorkers}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-black font-bold mb-2">
                    Duration
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-black font-bold mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-black font-bold mb-2">
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p>
                <span className="font-bold">Title:</span> {job.title}
              </p>
              <p>
                <span className="font-bold">Payscale:</span> ₹{job.payscale}/day
              </p>
              <p>
                <span className="font-bold">Required Skill:</span> {job.requiredSkill}
              </p>
              <p>
                <span className="font-bold">Experience Required:</span> {job.experienceRequired} years
              </p>
              <p>
                <span className="font-bold">No. of Workers:</span> {job.noOfWorkers}
              </p>
              <p>
                <span className="font-bold">Duration:</span> {job.duration}
              </p>
              <p>
                <span className="font-bold">Location:</span> {job.location}
              </p>
              <div>
                <span className="font-bold">Description:</span>
                <p className="mt-1">{job.description}</p>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </Layout>
  );
};

export default SingleJobPost;