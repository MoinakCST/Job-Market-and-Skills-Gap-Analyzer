import { useState, useEffect } from 'react'

export const useInterview = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const getReportById = async (interviewId) => {
    try {
      setLoading(true)
      // Try to fetch from localStorage first (for now, until backend GET endpoint is added)
      const storedReport = localStorage.getItem(`interview_${interviewId}`)
      if (storedReport) {
        setReport(JSON.parse(storedReport))
      } else {
        // Fallback to API call when backend endpoint is ready
        const response = await fetch(`/api/interview/${interviewId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setReport(data.interviewReport || data)
        }
      }
    } catch (error) {
      console.error('Error fetching interview report:', error)
    } finally {
      setLoading(false)
    }
  }

  const getResumePdf = async (interviewId) => {
    try {
      const report = localStorage.getItem(`interview_${interviewId}`)
      if (report) {
        const data = JSON.parse(report)
        if (data.resume) {
          // Create a blob and download
          const element = document.createElement('a')
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.resume))
          element.setAttribute('download', `resume_${interviewId}.txt`)
          element.style.display = 'none'
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
        }
      }
    } catch (error) {
      console.error('Error downloading resume:', error)
    }
  }

  return {
    report,
    getReportById,
    loading,
    getResumePdf
  }
}
