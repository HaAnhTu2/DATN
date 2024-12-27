// src/components/FormUser.tsx
import React, { useState, ChangeEvent } from 'react';
import { signup } from '../../api/user';
import { Signup } from '../../type/user';

interface CreateFormUserProps {
    setUsers: React.Dispatch<React.SetStateAction<Signup[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CreateFormUser: React.FC<CreateFormUserProps> = ({ setUsers, setMessage }) => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone_number, setPhoneNumber] = useState('');

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newUser = new FormData();
            newUser.append('first_name', first_name);
            newUser.append('last_name', last_name);
            newUser.append('email', email);
            newUser.append('password', password);
            newUser.append('phone_number', phone_number);

            const createdUser = await signup(newUser);
            setMessage('User created successfully!');
            setUsers(prevUsers => [...prevUsers, createdUser]);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
            resetForm();
        } catch (error) {
            setMessage('Phone number or email already exists');
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
    };

    return (
        <div className="row justify-content-center">
            <div className="col-lg-5">
                <div className="card shadow-lg border-0 rounded-lg">
                    <div className="p-5">
                        <form onSubmit={handleCreateUser}>
                            <h4>SignUp</h4>
                            <div className="col-md-12">
                                <label className="form-label">FirstName: </label>
                                <input type="text" value={first_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">LastName: </label>
                                <input type="text" value={last_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Email: </label>
                                <input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Password: </label>
                                <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Phone: </label>
                                <input type="text" value={phone_number} onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} className="form-control" />
                            </div>

                            <div className="col-auto">
                                <button type="submit" className="btn btn-outline-dark" style={{ margin: '10px' }}>{'Create User'}</button>
                                <button type="submit" className="btn btn-outline-dark" onClick={resetForm} style={{ margin: '10px' }}>Clear</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFormUser;
