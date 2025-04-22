import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProfileCard from '../components/ProfileCard'

const Matches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [preferences, setPreferences] = useState({
    age_min: '',
    age_max: '',
    religion: '',
    caste: '',
    education: '',
    occupation: ''
  })

  // For demo purposes, using user_id = 1
  const currentUserId = 1

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate age fields
    if (!preferences.age_min || !preferences.age_max) {
      setError('Minimum and maximum age are required')
      setLoading(false)
      return
    }
    if (parseInt(preferences.age_min) > parseInt(preferences.age_max)) {
      setError('Minimum age cannot be greater than maximum age')
      setLoading(false)
      return
    }

    try {
      // Save preferences using proxy
      const saveResponse = await axios.post('/api/save_preferences.php', {
        user_id: currentUserId,
        preferences
      })

      if (saveResponse.data.success) {
        alert('Preferences saved successfully!')
        // Fetch updated matches
        await fetchMatches()
      } else {
        setError(saveResponse.data.error || 'Failed to save preferences')
        setLoading(false)
      }
    } catch (err) {
      console.error('Save preferences error:', err)
      setError(`Failed to save preferences: ${err.message}`)
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
    try {
      // Fetch matches using proxy
      const response = await axios.post('/api/getmatches.php', {
        user_id: currentUserId
      })
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setMatches(response.data.matches)
      }
    } catch (err) {
      console.error('Fetch matches error:', err)
      setError(`Failed to fetch matches: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  if (loading) return <div className="text-center mt-8 text-custom-red">Loading...</div>
  if (error) return <div className="text-center mt-8 text-custom-red">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-custom-red">Potential Matches</h1>

      {/* Preference Form */}
      <div className="bg-custom-white border border-custom-pink rounded-lg p-6 mb-8 max-w-2xl mx-auto shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-custom-pink">Set Your Preferences</h2>
        <form onSubmit={handlePreferenceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-custom-red">Min Age *</label>
            <input
              type="number"
              name="age_min"
              value={preferences.age_min}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-custom-pink rounded focus:outline-none focus:border-custom-pink"
              required
              min="18"
            />
          </div>
          <div>
            <label className="block text-custom-red">Max Age *</label>
            <input
              type="number"
              name="age_max"
              value={preferences.age_max}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-custom-pink rounded focus:outline-none focus:border-custom-pink"
              required
              min="18"
            />
          </div>
          <div>
            <label className="block text-custom-red">Religion (optional)</label>
            <input
              type="text"
              name="religion"
              value={preferences.religion}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-custom-pink rounded focus:outline-none focus:border-custom-pink"
            />
          </div>
          <div>
            <label className="block text-custom-red">Caste (optional)</label>
            <input
              type="text"
              name="caste"
              value={preferences.caste}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-custom-pink rounded focus:outline-none focus:border-custom-pink"
            />
          </div>
          <div>
            <label className="block text-custom-red">Education (optional)</label>
            <input
              type="text"
              name="education"
              value={preferences.education}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-custom-pink rounded focus:outline-none focus:border-custom-pink"
            />
          </div>
          <div>
            <label className="block text-custom-red">Occupation (optional)</label>
            <input
              type="text"
              name="occupation"
              value={preferences.occupation}
              onChange={handlePreferenceChange}
              className="w-full p-2 border border-custom-pink rounded focus:outline-none focus:border-custom-pink"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-custom-red text-custom-white p-2 rounded hover:bg-red-700"
            >
              Save and Filter Matches
            </button>
          </div>
        </form>
        <p className="text-sm text-custom-pink mt-2">* Required fields</p>
      </div>

      {/* Matches Display */}
      <div className="flex flex-wrap justify-center">
        {matches.length > 0 ? (
          matches.map((profile) => (
            <ProfileCard key={profile.user_id} profile={profile} />
          ))
        ) : (
          <p className="text-center text-custom-red">No matches found based on your preferences</p>
        )}
      </div>
    </div>
  )
}

export default Matches