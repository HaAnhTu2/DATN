// src/components/FormUser.tsx
import React, { useState, ChangeEvent } from 'react';
import { signup } from '../../../services/userService';
import { Signup } from '../../../types/user';

interface CreateFormUserProps {
    setUsers: React.Dispatch<React.SetStateAction<Signup[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CreateFormUser: React.FC<CreateFormUserProps> = ({ setUsers, setMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');

    const handleCreateUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newUser = new FormData();
            newUser.append('email', email);
            newUser.append('password', password);
            newUser.append('birthday', birthday);
            newUser.append('gender', gender);
            console.log(gender);
            

            const createdUser = await signup(newUser);
            setMessage('User created successfully!');
            setUsers(prevUsers => [...prevUsers, createdUser]);
            setEmail('');
            setPassword('');
            setBirthday('');
            setGender('');
            resetForm();
        } catch (error) {
            setMessage('Phone number or email already exists');
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setBirthday('');
        setGender('');
    };

    return (
        <div className="row justify-content-center">
            <div className="col-lg-5">
                <div className="card shadow-lg border-0 rounded-lg">
                    <div className="p-5">
                        <form onSubmit={handleCreateUser}>
                            <h4>Đăng Ký</h4>
                            <div className="col-md-12">
                                <label className="form-label">Email: </label>
                                <input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Password: </label>
                                <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Ngày sinh: </label>
                                <input type="date" value={birthday} onChange={(e: ChangeEvent<HTMLInputElement>) => setBirthday(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Giới tính: </label>
                                <select
                                    value={gender}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>


                            <div className="col-auto">
                                <button type="submit" className="btn btn-outline-dark" style={{ margin: '10px' }}>{'Đăng Ký'}</button>
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
