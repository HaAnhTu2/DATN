import React, { useState } from "react";
import UserManagement from "../../components/sections/admin/UserManagement";
import UpdateFormUser from "../../components/form/user/Update";
import { User } from "../../types/user";

const UserManagementPage: React.FC = () => {
    const [, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState('');
    const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
    const handleSetFormUser = (user: User) => {
        setUserToEdit(user);
    };
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        {userToEdit ? (
                            <UpdateFormUser setUsers={setUsers}
                                setMessage={setMessage}
                                userToEdit={userToEdit} />
                        ) : (
                            <p>{message}</p>
                        )}
                        <div>
                            <UserManagement setFormUser={handleSetFormUser} />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UserManagementPage;