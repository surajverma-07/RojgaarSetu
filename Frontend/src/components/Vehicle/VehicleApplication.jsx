import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useGetVehicleByIdQuery, useApplyToVehicleMutation } from '@/redux/api/vehicleApiSlice';

export default function VehicleApplication() {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const { data, isLoading } = useGetVehicleByIdQuery(vehicleId);
  const [applyToVehicle, { isLoading: isApplying }] = useApplyToVehicleMutation();

  const vehicle = data?.vehicleForm || {};

  const [form, setForm] = useState({
    type: vehicle.type || '',
    brand: vehicle.brand || '',
    quantity: vehicle.quantity || '',
    purchaseDate: vehicle.purchaseDate?.split('T')[0] || '',
    location: vehicle.location || '',
    ownerDetails: '',
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(urls);
  };

const handleSubmit = async e => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('workerId', user._id);
    formData.append('type', form.type);
    formData.append('brand', form.brand);
    formData.append('quantity', form.quantity);
    formData.append('purchaseDate', form.purchaseDate);
    formData.append('location', form.location);
    formData.append('ownerDetails', form.ownerDetails);

    // Append all image files
    files.forEach((file, index) => {
      formData.append('vehicles', file); // backend must accept an array under "pictures"
    });

    await applyToVehicle({ vehicleId, formData }).unwrap();
    toast.success('Application submitted');
    navigate('/vehicle/applications');
  } catch (err) {
    console.error(err);
    toast.error(err?.data?.message || 'Apply failed');
  }
};


  if (isLoading) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Apply for {vehicle.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        {[
          { name: 'type', label: 'Vehicle Type' },
          { name: 'brand', label: 'Brand' },
          { name: 'quantity', label: 'Quantity', type: 'number' },
          { name: 'purchaseDate', label: 'Purchase Date', type: 'date' },
          { name: 'location', label: 'Location' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block mb-1 text-sm font-medium">{label}</label>
            <input
              type={type || 'text'}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-sm font-medium">Your Details*</label>
          <textarea
            name="ownerDetails"
            rows={4}
            value={form.ownerDetails}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Upload Vehicle Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full"
          />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {previews.map((src, idx) => (
                <img key={idx} src={src} alt="preview" className="h-24 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isApplying}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isApplying ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>

      <Link
        to={`/vehicle/view/${vehicleId}`}
        className="block text-center text-blue-600 mt-6 hover:underline"
      >
        ← Back to Details
      </Link>
    </div>
  );
}
