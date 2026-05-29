import React from 'react'
import { Link } from 'react-router-dom'
import "../auth.form.scss"

const Register = () => {
  return (
    <main>
        <div className="form-container">
             <h1>Register</h1>
             
             <form>
                <div className="input-group">
                    <label htmlFor="name">Full Name</label>
                    <input type = "text" id="name" name='name' placeholder='Enter full name'/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type = "email" id="email" name='email' placeholder='Enter email address'/>
                </div>
                <div className="input-group">
                     <label htmlFor="password">Password</label>
                       <input
                         type="password"
                          id="password"
                          name="password"
                          placeholder="Enter password"
                       />
                </div>
                <div className="input-group">
                     <label htmlFor="confirmPassword">Confirm Password</label>
                       <input
                         type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm password"
                       />
                </div>
                <button className='button primary-button'>Register</button>
             </form>
             <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    </main>
  )
}

export default Register
