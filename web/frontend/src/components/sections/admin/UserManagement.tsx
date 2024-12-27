import React, { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../../services/userService";
import { User } from "../../../types/user";
import { Row, Card, Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

interface UserManagementProps {
    setFormUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ setFormUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
                setloading(false);
            } catch (error) {
                console.error('error fetching users:', error);
                setloading(false);
            }
        };
        fetchUsers();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    const handleCreateClick = () => {
        navigate(`/create/user`);
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleUpdateUser = (user: User) => {
        setFormUser(user);
    };
    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUser(id)
            setUsers(users.filter(user => user._id != id))
        } catch (error) {
            console.error('error deleting user:', error);
        }
    }
    return (
        <Row className="mt-6">
            <Card className="h-100">
                <div className="bg-white  py-4">
                    <h4 className="mb-0">User</h4>
                    {/* Search Form */}
                    <Form className="d-flex align-items-center" style={{ margin: '10px' }}>
                        <Form.Control type="search" placeholder="Search" value={searchTerm} onChange={handleSearch} />
                    </Form>
                    <Button onClick={handleCreateClick}>
                        <span>Create User</span>
                    </Button>
                </div>
                <Table responsive className="text-nowrap">
                    <thead className="table-light">
                        <tr>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.userimage_url ? (
                                        <img
                                            src={`http://localhost:3000/image/${user.userimage_url}`}
                                            alt={user.first_name + user.last_name}
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>
                                    <button type="submit" className="btn btn-outline-dark" onClick={() => handleUpdateUser(user)}>Edit</button>
                                    <button type="submit" className="btn btn-outline-dark" onClick={() => handleDeleteUser(user._id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Row>
    );
};
export default UserManagement;