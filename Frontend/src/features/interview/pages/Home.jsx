import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/home.scss"

const Home = () => {
  console.log("HOME COMPONENT RENDERED");
  const navigate = useNavigate()
  const [charCount, setCharCount] = useState(0)
  const [jobDesc, setJobDesc] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJobDescChange = (e) => {
    const text = e.target.value
    setJobDesc(text)
    setCharCount(text.length)
  }

  const handleResumeChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleSelfDescriptionChange = (e) => {
    setSelfDescription(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

  console.log("FORM SUBMITTED");
  console.log("jobDesc:", jobDesc);
  console.log("selfDescription:", selfDescription);
  console.log("resumeFile:", resumeFile);

    setError('')

    if (!jobDesc.trim()) {
      setError('Job description is required')
      return
    }

    if (!resumeFile && !selfDescription.trim()) {
      setError('Please upload a resume or provide a self description')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('jobDescription', jobDesc)
      formData.append('selfDescription', selfDescription)
      if (resumeFile) {
        formData.append('resume', resumeFile)
      }

      const token = localStorage.getItem('token')
      console.log("About to call fetch...")
      console.log("Token:", token)
      console.log("FormData prepared")
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to generate interview report')
      }

      const data = await response.json()
      console.log('Interview report generated:', data)
      // You can store the report and redirect to results page
      console.log("Interview ID:", data.interviewReport?._id)
      localStorage.setItem(`interview_${data.interviewReport._id}`, 
      JSON.stringify(data.interviewReport))

      // Redirect or show success
      navigate(`/interview/${data.interviewReport._id}`)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Failed to generate interview report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='home'>
      <div className="container">
        <div className="header">
          <h1>Build Your <span className='highlight'>Interview Strategy</span></h1>
          <p>Paste a job description and we'll help you prep an interview game plan</p>
        </div>

        <form onSubmit={handleSubmit} className="interview-input-grp">
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          
          <div className="left">
            <div className="section-header">
              <h2>Job Description</h2>
              {/* <span className="required">Required</span> */}
            </div>
            <textarea
              name="jobDescription"
              id="jobDescription"
              value={jobDesc}
              onChange={handleJobDescChange}
              placeholder="paste the job description here..."
              maxLength={5000}
              required
            ></textarea>
            <div className="char-count">{charCount} / 5000</div>
          </div>

          <div className="right">
            <div className="input-group">
              <div className="section-header">
                <span className="icon"></span>
                <h2>Your Info</h2>
              </div>
              <p className='highlight' >Upload Your Resume <small className='note'>(optional)</small></p>
              <div className="upload-area">
                <label htmlFor="resume" className='file-label'>
                  <div className="upload-content">
                    <span className="upload-icon"></span>
                    <p>{resumeFile ? resumeFile.name : '  Upload your file here..'}</p>
                    <small>PDF, DOC</small>
                  </div>
                </label>
                <input hidden
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </div>

              <div className="divider">OR</div>

              <div className="input-group">
                <label htmlFor="selfDescription">Tell us about yourself</label>
                <textarea
                  name="selfDescription"
                  id="selfDescription"
                  value={selfDescription}
                  onChange={handleSelfDescriptionChange}
                  placeholder="Just describe what you know - skills, experience, years in tech, etc..."
                ></textarea>
              </div>

              <div className="info-note">
                <input type="checkbox" id="useResume" defaultChecked disabled />
                <label htmlFor="useResume">Resume or self description required</label>
              </div>
            </div>

            <button type="submit" className="button primary-button" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Strategy'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Home;