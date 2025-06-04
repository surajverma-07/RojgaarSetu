"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  useProcessVehicleApplicationMutation,
} from "@/redux/api/contractorApiSlice"
import { toast } from "react-hot-toast"
import { useGetVehicleApplicationByIdQuery } from "@/redux/api/vehicleApiSlice"
import { useSelector } from "react-redux"
function SingleVehicleApplication() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const {data,isLoading:isLoading,error} = useGetVehicleApplicationByIdQuery(applicationId)
  const application = data?.application || {}
  const applicant = application.applicantId || {}
  const {userType} = useSelector((state) => state.auth)
  const [processVehicleApplication] = useProcessVehicleApplicationMutation()
  const [feedback, setFeedback] = useState("")

  const handleAction = async (action) => {
    if (!action) return

    try {
      await processVehicleApplication({
        applicationId,
        data: { action, feedback },
      }).unwrap()

      toast.success(`Application ${action}ed successfully!`)
      navigate("/vehicle/applications")
    } catch (err) {
      console.error("Processing error:", err)
      toast.error("Failed to process application.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Vehicle Application</h1>

      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Applicant Information</h2>
          <p><strong>Name:</strong> {applicant.name}</p>
          <p><strong>Email:</strong> {applicant.email}</p>
          <p><strong>Phone:</strong> {applicant.phone}</p>
          <p><strong>Status:</strong> {application.status}</p>
          <p><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleString()}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Vehicle Details</h2>
          <p><strong>Type:</strong> {application.type}</p>
          <p><strong>Brand:</strong> {application.brand}</p>
          <p><strong>Quantity:</strong> {application.quantity}</p>
          <p><strong>Location:</strong> {application.location}</p>
          <p><strong>Organization:</strong> {application.vehicleFormId?.organization}</p>
          <p><strong>Purchase Date:</strong> {new Date(application.purchaseDate).toLocaleDateString()}</p>
          <p><strong>Other Details:</strong> {application.vehicleFormId?.otherDetails}</p>
        </div>
      </section>

      {application.pictures && application.pictures.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Vehicle Pictures</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {application.pictures.map((pic, index) => (
              <img
                key={index}
                src={pic}
                alt={`Vehicle ${index + 1}`}
                className="w-full h-32 object-cover rounded-md shadow-sm hover:scale-105 transition"
              />
            ))}
          </div>
        </div>
      )}

      {userType==='Contractor' && application.status === "pending" && (
        <div className="mt-6">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback for rejection (optional)"
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={4}
          ></textarea>
        </div>
      )}
     {userType==='Owner' && application.status === 'rejected' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Feedback</h2>
          <p className="text-gray-600">{application.feedback || "No feedback provided."}</p>
        </div>
        
     )}
      <div className="mt-8 flex flex-wrap gap-4">
        {userType==='Contractor' && application.status === "pending" && (
          <>
            <button
              onClick={() => handleAction("accept")}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction("reject")}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default SingleVehicleApplication
