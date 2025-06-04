import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '@/redux/api/contractorApiSlice';
import { useGetVehicleByIdQuery } from '@/redux/api/vehicleApiSlice';
import { useSelector } from 'react-redux';
import Layout from '../Layout/Layout';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

const SingleVehiclePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vehicleData, isLoading, isError } = useGetVehicleByIdQuery(id);
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  const { user, userType } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    payscale: '',
    brand: '',
    quantity: '',
    purchaseDate: '',
    location: '',
    organization: '',
    otherDetails: '',
  });

  useEffect(() => {
    if (vehicleData?.vehicleForm) {
      const v = vehicleData.vehicleForm;
      setFormData({
        title: v.title || '',
        type: v.type || '',
        payscale: v.payscale || '',
        brand: v.brand || '',
        quantity: v.quantity || '',
        purchaseDate: v.purchaseDate?.split('T')[0] || '',
        location: v.location || '',
        organization: v.organization || '',
        otherDetails: v.otherDetails || '',
      });
    }
  }, [vehicleData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (vehicleData?.vehicleForm) {
      const v = vehicleData.vehicleForm;
      setFormData({
        title: v.title,
        type: v.type,
        payscale: v.payscale,
        brand: v.brand,
        quantity: v.quantity,
        purchaseDate: v.purchaseDate?.split('T')[0],
        location: v.location,
        organization: v.organization,
        otherDetails: v.otherDetails,
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateVehicle({ id, ...formData }).unwrap();
      toast.success('Vehicle post updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed. Please try again.');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteVehicle(id).unwrap();
      toast.success('Vehicle post deleted successfully!');
      navigate('/contractor/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || 'Deletion failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !vehicleData?.vehicleForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
            <p>Vehicle post not found or unauthorized.</p>
            <Link
              to="/contractor/dashboard"
              className="text-blue-600 hover:text-blue-500 mt-4 inline-block"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const vehicle = vehicleData.vehicleForm;

  return (
    <Layout>
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      <motion.section
        className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-black">Vehicle Details</h2>
            {!isEditing && (
              <div className="space-x-2">
                {userType === 'Contractor' && (
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
                )}
                {userType === 'Owner' && (
                  <button
                    onClick={() => navigate(`/vehicle/apply/${vehicle._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              {[{ name: 'title', label: 'Vehicle Title' },
                { name: 'type', label: 'Type' },
                { name: 'payscale', label: 'Payscale (₹/day)', type: 'number' },
                { name: 'brand', label: 'Brand' },
                { name: 'quantity', label: 'Quantity', type: 'number' },
                { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
                { name: 'location', label: 'Location' },
                { name: 'organization', label: 'Organization' }].map(({ name, label, type = 'text' }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-black font-bold mb-2">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    required
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-600"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="otherDetails" className="block text-black font-bold mb-2">
                  Other Details
                </label>
                <textarea
                  id="otherDetails"
                  name="otherDetails"
                  rows="4"
                  required
                  value={formData.otherDetails}
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
              <p><span className="font-bold">Title:</span> {vehicle.title}</p>
              <p><span className="font-bold">Type:</span> {vehicle.type}</p>
              <p><span className="font-bold">Payscale:</span> ₹{vehicle.payscale}/day</p>
              <p><span className="font-bold">Brand:</span> {vehicle.brand}</p>
              <p><span className="font-bold">Quantity:</span> {vehicle.quantity}</p>
              <p><span className="font-bold">Purchase Date:</span> {vehicle.purchaseDate?.split('T')[0]}</p>
              <p><span className="font-bold">Location:</span> {vehicle.location}</p>
              <p><span className="font-bold">Organization:</span> {vehicle.organization}</p>
              <div>
                <span className="font-bold">Other Details:</span>
                <p className="mt-1">{vehicle.otherDetails}</p>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </Layout>
  );
};

export default SingleVehiclePost;
