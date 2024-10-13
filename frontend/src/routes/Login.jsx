import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backend from '../backend.js'; 

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const res = await backend.post('/auth/password', {
        username: username,
        password: password
      })

      // Get url params for path to redirect back to
      const url = new URL(window.location.href)
      const redirPath = url.searchParams.get("from") ?? '/' // default to main page
      navigate(redirPath)
    } catch (err) {
      // TODO: display error message
      if (err.serverResponds) {
        console.log("Server responds with status " + err.response.status)
      } else if (err.requestSent) {
        console.log("Server timed out!")
      }
    }
  }

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
        <button type="button" onClick={()=>handleLogin()}>Login</button>
      </form>

       {/* Placeholder for OAuth (e.g., Spotify login) */}
      {/* TODO: Add Spotify login integration */}
    </div>
  );
}

export default Login;
