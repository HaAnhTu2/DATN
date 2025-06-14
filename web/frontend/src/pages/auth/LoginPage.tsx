import { useState } from "react"
import { User } from "../../types/user"
import Login from "../../components/sections/auth/Login"
import { useAuth } from './AuthContext';


const LoginPage: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User[] | null>(null);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const handleLogin = () => {
    login();
  };
  return (
    <div className="section">
      <header className="container">
        <div className="row">
          <div className="col-md-12" onClick={handleLogin}>
            <Login setLogin={setLoggedInUser} setError={setError} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loggedInUser && <p>Welcome!</p>}
          </div></div>
      </header>
    </div>
  )
}
export default LoginPage