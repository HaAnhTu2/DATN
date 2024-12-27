// src/components/FormUser.tsx
import React, { useState, ChangeEvent } from 'react';
import { createUser } from '../../../../api/user';
import { User } from '../../../../type/user';

interface CreateFormUserProps {
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CreateFormUser: React.FC<CreateFormUserProps> = ({ setUsers, setMessage }) => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newUser = new FormData();
            newUser.append('first_name', first_name);
            newUser.append('last_name', last_name);
            newUser.append('email', email);
            newUser.append('password', password);
            newUser.append('address', address);
            newUser.append('phone_number', phone_number);
            newUser.append('role', role);
            if (image) {
                newUser.append('image', image);
            }
            const createdUser = await createUser(newUser);
            setMessage('User created successfully!');
            setUsers(prevUsers => [...prevUsers, createdUser]);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setPhoneNumber('');
            setRole('');
            setImage(null);
            resetForm();
        } catch (error) {
            setMessage('Error creating user');
        }
    };
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };
    const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
    };
    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setAddress('');
        setPhoneNumber('');
        setRole('');
        setImage(null);
    };

    return (
        <div className="row justify-content-center">
            <div className="col-lg-5">
                <div className="card shadow-lg border-0 rounded-lg">
                    <div className="p-5">
                        <form onSubmit={handleCreateUser}>
                            <h4>Create</h4>
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
                            <div className="col-md-6">
                                <label className="form-label">Role: </label>
                                <select value={role} onChange={handleRoleChange} className="form-select">
                                    <option value="">Select a role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                    <option value="Guest">Guest</option>
                                </select>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Address: </label>
                                <input type="text" value={address} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Phone Number: </label>
                                <input type="text" value={phone_number} onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Image: </label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
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
