import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../auth.form.scss"

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")



  const handleSubmit = (e) => {
      e.preventDefault()
  }

  return (
    <main>
        <div className="form-container">
             <h1>Register</h1>
             
             <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <label htmlFor="name">Username</label>
                    <input 
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type = "text" id="name" name='name' placeholder='Enter username'/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type = "email" id="email" name='email' placeholder='Enter email address'/>
                </div>
                <div className="input-group">
                     <label htmlFor="password">Password</label>
                       <input
                         onChange={(e)=>{setPassword(e.target.value)}}
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
