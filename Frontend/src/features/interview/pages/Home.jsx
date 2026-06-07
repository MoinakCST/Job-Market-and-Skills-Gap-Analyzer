import React, { useState } from 'react'
import "../styles/home.scss"

const Home = () => {
  const [charCount, setCharCount] = useState(0)
  const [jobDesc, setJobDesc] = useState('')

  const handleJobDescChange = (e) => {
    const text = e.target.value
    setJobDesc(text)
    setCharCount(text.length)
  }

  return (
    <main className='home'>
      <div className="container">
        <div className="header">
          <h1>Build Your <span className='highlight'>Interview Strategy</span></h1>
          <p>Paste a job description and we'll help you prep an interview game plan</p>
        </div>

        <div className="interview-input-grp">
          <div className="left">
            <div className="section-header">
              {/* <span className="icon">📋</span> */}
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
            ></textarea>
            <div className="char-count">{charCount} / 5000</div>
          </div>

          <div className="right">
            <div className="input-group">
              <div className="section-header">
                <span className="icon">👤</span>
                <h2>Your Info</h2>
              </div>
              <p className='highlight' >Upload Your Resume <small className='note'>(optional)</small></p>
              <div className="upload-area">
                <label htmlFor="resume" className='file-label'>
                  <div className="upload-content">
                    <span className="upload-icon">📤</span>
                    <p>drag file here or click</p>
                    <small>PDF, DOC</small>
                  </div>
                </label>
                <input hidden
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div className="divider">OR</div>

              <div className="input-group">
                <label htmlFor="selfDescription">Tell us about yourself</label>
                <textarea
                  name="selfDescription"
                  id="selfDescription"
                  placeholder="just describe what you know - skills, experience, years in tech, etc..."
                ></textarea>
              </div>

              <div className="info-note">
                <input type="checkbox" id="useResume" defaultChecked />
                <label htmlFor="useResume">Resume or self description required</label>
              </div>
            </div>

            <button className="button primary-button">
              Generate Strategy
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;