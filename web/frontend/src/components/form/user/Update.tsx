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
    const [first_name, setFirstName] = useState(userToEdit.first_name);
    const [last_name, setLastName] = useState(userToEdit.last_name);
    const [email, setEmail] = useState(userToEdit.email);
    const [password, setPassword] = useState(userToEdit.password);
    const [address, setAddress] = useState(userToEdit.address);
    const [phone_number, setPhoneNumber] = useState(userToEdit.phone_number);
    const [role, setRole] = useState(userToEdit.role)
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        setFirstName(userToEdit.first_name);
        setLastName(userToEdit.last_name);
        setEmail(userToEdit.email);
        setPassword(userToEdit.password);
        setAddress(userToEdit.address);
        setPhoneNumber(userToEdit.phone_number);
        setRole(userToEdit.role);
        setImage(userToEdit.userimage_url)
    }, [userToEdit]);

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = { ...userToEdit, first_name, last_name, email, password, address, phone_number, role, image };
            await updateUser(userToEdit._id, updatedUser);
            setUsers(prevUsers =>
                prevUsers.map(user => (user._id === userToEdit._id ? updatedUser : user)));
            setMessage("User updated successfully!");
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
    const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
    };

    return (
        <form onSubmit={handleUpdateUser}>
            <div>
                <label>FirstName: </label><br />
                <input type="text" value={first_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} required />
            </div>
            <div>
                <label>LastName: </label><br />
                <input type="text" value={last_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} required />
            </div>
            <div>
                <label>Email: </label><br />
                <input type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password: </label><br />
                <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Address: </label><br />
                <input type="text" value={address} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} required />
            </div>
            <div>
                <label>Phone: </label><br />
                <input type="text" value={phone_number} onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} required />
            </div>
            <div>
                <label>Role: </label><br />
                <select value={role} onChange={handleRoleChange} className="form-select">
                    <option value="">Select a role</option>
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
