import React, { useState } from 'react'

const ProfileCard = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-custom-white border border-custom-pink rounded-lg m-4 w-80 shadow-md">
      <div
        className="bg-custom-pink flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <h2 className="text-lg font-bold text-custom-white">{profile.first_name} {profile.last_name}</h2>
        <svg
          className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''} text-custom-white`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isExpanded && (
        <div className="p-4 text-custom-red">
          <p className="mb-1">Age: {calculateAge(profile.dob)}</p>
          <p className="mb-1">Location: {profile.city}, {profile.country}</p>
          <p className="mb-1">Occupation: {profile.occupation}</p>
          <p className="mb-1">Education: {profile.education}</p>
          <p className="mb-1">Religion: {profile.religion}</p>
          <p className="mb-1">Caste: {profile.caste}</p>
          <p className="mb-1">Income: {profile.income_range}</p>
          <p className="mt-2">{profile.bio}</p>
        </div>
      )}
    </div>
  )
}

export default ProfileCard