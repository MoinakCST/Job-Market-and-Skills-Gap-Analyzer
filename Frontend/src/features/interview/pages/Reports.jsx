import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "../styles/home.scss"
import "../styles/reports.scss"
import { useInterview } from '../hooks/useInterview.js'

const Reports = () => {
    const { loading, reports } = useInterview()
    const navigate = useNavigate()

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview reports...</h1>
            </main>
        )
    }

    return (
        <div className='reports-page'>
            <header className='reports-page__header'>
                <div>
                    <h1>Report History</h1>
                    <p>Only your latest 5 interview reports are kept automatically.</p>
                </div>
                <Link to='/' className='reports-page__back'>Back to Home</Link>
            </header>

            {reports?.length > 0 ? (
                <section className='recent-reports'>
                    <ul className='reports-list'>
                        {reports.map((report) => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : (
                <div className='reports-page__empty'>
                    <p>No reports yet.</p>
                </div>
            )}
        </div>
    )
}

export default Reports
