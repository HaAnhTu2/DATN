import React, { useState, FormEvent, ChangeEvent } from 'react';
import { login } from '../../../services/authService';
import { getUsers } from '../../../services/userService';
import { User } from '../../../types/user';
import { useNavigate } from 'react-router-dom';

interface LoginUserProps {
    setLogin: React.Dispatch<React.SetStateAction<User[] | null>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<LoginUserProps> = ({ setLogin, setError }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [localError, setLocalError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = await login(email, password)
            localStorage.setItem('token', token);
            setLocalError('');
            const user = await getUsers();
            setLogin(user);
            console.log(token)
            console.log(user)
            navigate('/home')
        } catch (error) {
            setError('Error login user');
        }
    };
    return (
        <div className="row justify-content-center">
            <div className="col-lg-4">
                <div className="card shadow-lg border-0 rounded-lg">
                    <div className="p-5">
                        <form onSubmit={handleLogin}>
                            <h4>Login</h4>
                            <p className="mb-2">Please enter your user information.</p>
                            <div className='mb-4'>
                                <label className="form-label">Email:</label><br />
                                <input type="email" name="username" className="form-control"
                                    placeholder="Enter address here" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                            </div>
                            <div className='mb-4'>
                                <label className="form-label">Password:</label><br />
                                <input type="password" name="password" className="form-control"
                                    placeholder="**************" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                            </div>
                            <div>
                                {localError && <p style={{ color: 'red' }}>{localError}</p>}
                                <button type="submit" className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

};


export default Login;