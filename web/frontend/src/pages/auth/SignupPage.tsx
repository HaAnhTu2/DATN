import React, { useState } from 'react';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.email) {
            setError({ ...error, email: 'Email is required' });
        }
        // Logic xử lý đăng ký
    };

    return (
        <div>
            <h1>Signup</h1>
            <form>
                <Input
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={error.email}
                />
                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={error.password}
                />
                <Button label="Sign Up" onClick={handleSubmit} />
            </form>
        </div>
    );
};

export default SignupPage;
