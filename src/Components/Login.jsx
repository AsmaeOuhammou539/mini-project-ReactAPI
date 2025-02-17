import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('dev.ou@gmail.com');
  const [password, setPassword] = useState('Asmae1976');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8000/api/login`;
    try {
      const resp = await axios.post(url, { email, password });
      const token = resp.data.token;
      localStorage.setItem('token', token);
      // console.log(token);
      
      const userName = resp.data.user.name;
      console.log('Nom utilisateur:', userName);
      setName(userName);

      navigate('/', { state: { name: userName } });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
          <div className="auth-form">
            <h1>WELCOME BACK !</h1>
            <p>
              Don't have an account? <Link to="/SignUp">Sign up</Link>
            </p>
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="button-group">
              <button onClick={login}>Sign In</button>
            </div>
          </div>
          <img className="auth-image" src="login3.jpg" alt="Login Illustration" />
        </div>
    </div>

  );
}

export default Login;


