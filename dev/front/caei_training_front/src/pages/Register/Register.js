import { Link } from 'react-router-dom';
import './Register.css'; // Add custom styles

export default function Register() {
  return (
    <div className="register-container">
      <div className="register-form-container">
        <form className="register-form">
          <h2 className="form-title">Create Account</h2>

          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter your name" 
              id="name" 
              aria-describedby="nameHelp" 
            />
          </div>

          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email" 
              id="email" 
              aria-describedby="emailHelp" 
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password" 
              id="password" 
            />
          </div>

          <div className="button-group">
            <button type="button" className="btn btn-success"><Link className="nav-link active" to="/login">Create Account</Link></button>
          </div>

          <p className="redirect-link">
            Already have an account? 
            <Link to="/login" className="link-to-login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
