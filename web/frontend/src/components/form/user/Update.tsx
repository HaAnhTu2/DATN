// src/components/FormUser.tsx
import React, { useState, ChangeEvent, useEffect } from 'react';
import { updateUser } from '../../../services/userService';
import { User } from '../../../types/user';

interface UpdateFormUserProps {
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    userToEdit: User;
}

const UpdateFormUser: React.FC<UpdateFormUserProps> = ({ setUsers, setMessage, userToEdit }) => {
    const [email, setEmail] = useState(userToEdit.email);
    const [password, setPassword] = useState(userToEdit.password);
    const [gender, setGender] = useState(userToEdit.gender);
    const [birthday, setBirthday] = useState(userToEdit.birthday);
    const [status, setStatus] = useState(userToEdit.status)
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        setEmail(userToEdit.email);
        setPassword(userToEdit.password);
        setGender(userToEdit.gender);
        setBirthday(userToEdit.birthday);
        setStatus(userToEdit.status);
    }, [userToEdit]);

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = { ...userToEdit, email, password, gender, birthday, status, image };
            await updateUser(userToEdit.user_id, updatedUser);
            setUsers(prevUsers =>
                prevUsers.map(user => (user.user_id === userToEdit.user_id ? updatedUser : user)));
            setMessage("User updated successfully!");
            window.location.reload(); 

        } catch (error) {
            setMessage('Error updating user');
        }
    };
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };
    const handlestatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setStatus(event.target.value);
    };

    return (
        <form onSubmit={handleUpdateUser}>
            <div>
                <label>Email: </label><br />
                <input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password: </label><br />
                <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>gender: </label><br />
                <input type="text" value={gender} onChange={(e: ChangeEvent<HTMLInputElement>) => setGender(e.target.value)} required />
            </div>
            <div>
                <label>Phone: </label><br />
                <input type="text" value={birthday} onChange={(e: ChangeEvent<HTMLInputElement>) => setBirthday(e.target.value)} required />
            </div>
            <div>
                <label>status: </label><br />
                <select value={status} onChange={handlestatusChange} className="form-select">
                    <option value="">Select a status</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Guest">Guest</option>
                </select>
            </div>
            <div>
                <label>Image: </label><br />
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <button type="submit" className="btn btn-outline-dark">{'Update User'}</button>
        </form>
    );
};

export default UpdateFormUser;
