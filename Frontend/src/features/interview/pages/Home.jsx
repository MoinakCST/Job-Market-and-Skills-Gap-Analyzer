import { useState, useRef } from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {

    const { loading, generateReport } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeUploaded, setResumeUploaded ] = useState(false)
    const resumeInputRef = useRef()

    const navigate = useNavigate()
    const jobDescriptionCount = jobDescription.length

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>
            <div className='interview-card'>
                <div className='simple-form'>
                    <div className='field field--job-description'>
                        <div className='field__header'>
                            <div className='field__title-group'>
                                <svg className='field__icon' viewBox='0 0 24 24' aria-hidden='true'>
                                    <path d='M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01' />
                                </svg>
                                <h2>Target Job Description</h2>
                            </div>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            value={jobDescription}
                            className='field__input field__input--textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescriptionCount} / 5000 chars</div>
                    </div>

                    <div className='field'>
                        <div className='field__header'>
                            <div className='field__title-group'>
                                <svg className='field__icon' viewBox='0 0 24 24' aria-hidden='true'>
                                    <path d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.5-8 5.5V21h16v-1.5C20 16.5 16.4 14 12 14Z' />
                                </svg>
                                <h2>Your Profile</h2>
                            </div>
                        </div>
                        <div className='profile-block'>
                            <label className='field__label' htmlFor='resume'>{resumeUploaded ? 'Uploaded' : 'Upload Resume'}</label>
                        </div>
                        <label className='dropzone' htmlFor='resume'>
                            <svg className='dropzone__icon' viewBox='0 0 24 24' aria-hidden='true'>
                                <path d='M12 3v12m0 0 4-4m-4 4-4-4M20 15.5a4.5 4.5 0 0 0-3-4.24A6 6 0 0 0 5 13.5a4 4 0 0 0 1 7.88H19a4 4 0 0 0 1-7.88Z' />
                            </svg>
                            <span className='dropzone__title'>Click to upload or drag &amp; drop</span>
                            <span className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</span>
                            <input
                                ref={resumeInputRef}
                                hidden
                                type='file'
                                id='resume'
                                name='resume'
                                accept='.pdf,.docx'
                                onChange={(e) => { setResumeUploaded(Boolean(e.target.files && e.target.files[0])) }}
                            />
                        </label>

                        <div className='or-divider'><span>OR</span></div>

                        <div className='self-description'>
                            <label className='field__label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                value={selfDescription}
                                id='selfDescription'
                                name='selfDescription'
                                className='field__input field__input--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>
                    </div>
                </div>

                <div className='interview-card__footer'>
                    <div className='footer-actions'>
                        <Link to="/reports" className='reports-btn'>View Report History</Link>
                        <button
                            onClick={handleGenerateReport}
                            className='generate-btn'>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home