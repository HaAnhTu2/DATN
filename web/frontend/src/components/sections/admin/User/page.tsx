import React, { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../../../services/userService";
import { User } from "../../../../types/user";
import { Row, Card, Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <span>Loading...</span>
            </div>
        );
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateUser = (user: User) => {
        navigate(`/user/edit/${user.user_id}`);
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(user => user.user_id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Row className="mt-4" style={{ fontSize: '1.8rem' }}>
            <Card className="w-100 shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0" style={{ fontSize: '2rem' }}>User Management</h4>
                        {/* Uncomment if create user feature added */}
                        {/* <Button variant="primary" onClick={() => navigate("/users/create")}>Create User</Button> */}
                    </div>
                    <Form className="mb-3">
                        <Form.Control
                            type="search"
                            placeholder="Search by email"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Form>
                    <Table responsive bordered hover className="text-nowrap align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Birthday</th>
                                <th>Status</th>
                                <th>Role</th>
                                <th style={{ width: "140px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.email}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.birthday}</td>
                                        <td>{user.status}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleUpdateUser(user)}
                                                className="me-2"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.user_id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Row>
    );
};

export default UserManagement;
