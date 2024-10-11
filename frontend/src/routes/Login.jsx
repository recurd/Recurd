import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../../../../auth';  // Import the auth object

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // You could add real validation/authentication logic here
    if (username === 'user' && password === 'password') {
      auth.login(() => {
        navigate('/dashboard');  // Redirect to the dashboard page after login
      });
    } else {
      alert('Incorrect login credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>

       {/* Placeholder for OAuth (e.g., Spotify login) */}
      {/* TODO: Add Spotify login integration */}
      
    </div>
  );
}

export default Login;
