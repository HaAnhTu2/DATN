import React, { useState } from "react";
import UserList from "../../components/sections/dashboard/user/UserList";
import UpdateFormUser from "../../components/sections/dashboard/user/Update";
import { User } from "../../type/user";

const UpdateUserPage: React.FC = () => {
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
                            <UserList setFormUser={handleSetFormUser} />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateUserPage;