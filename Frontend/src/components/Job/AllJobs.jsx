import { useState } from 'react'
import { useGetAllJobsQuery } from '../../redux/api/jobsApiSlice'
import {  Briefcase, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const AllJobs = () => {
  const { data, isLoading, isError, refetch } = useGetAllJobsQuery()
  const [searchTerm, setSearchTerm] = useState('')
  const [minPayscale, setMinPayscale] = useState('')
  const [minExperience, setMinExperience] = useState('')

  const filterJobs = () => {
    const jobs = data?.jobPosts || []
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkill.toLowerCase().includes(searchTerm.toLowerCase())

      const meetsPayscale =
        minPayscale === '' || job.payscale >= parseInt(minPayscale)

      const meetsExperience =
        minExperience === '' ||
        (job.experienceRequired || 0) >= parseInt(minExperience)

      return matchesSearch && meetsPayscale && meetsExperience
    })
  }

  const filteredJobs = filterJobs()

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
              <p className="text-gray-600 mt-1">
                Search and apply to jobs that match your skills and preferences
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by title, location, skill"
              className="border border-gray-300 rounded px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Payscale (₹)"
              className="border border-gray-300 rounded px-4 py-2"
              value={minPayscale}
              onChange={(e) => setMinPayscale(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Experience (years)"
              className="border border-gray-300 rounded px-4 py-2"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">
                  Failed to load jobs. Please try again later.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📍 {job.location}</span>
                          <span>💰 ₹{job.payscale}/day</span>
                          <span>🛠️ {job.requiredSkill}</span>
                          {job.experienceRequired && (
                            <span>🧰 {job.experienceRequired}+ years</span>
                          )}
                          <span>👷 {job.noOfWorkers} workers</span>
                        </div>
                      </div>
                      <Link
                        to={`/job/view/${job._id}`}
                        className="ml-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-12">
                  No matching jobs found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllJobs
