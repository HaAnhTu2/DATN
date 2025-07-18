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
        navigate(`/user/update/${user.user_id}`);
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
        <Row className="mt-4">
            <Card className="w-100 shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0" style={{ fontSize: '2rem' }}>Quản lý khách hàng</h4>
                    </div>
                    <Form className="mb-3">
                        <Form.Control
                            type="search"
                            placeholder="Tìm theo email"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Form>
                    <Table responsive bordered hover className="text-nowrap align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Email</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Trạng thái</th>
                                <th>Quyền</th>
                                <th style={{ width: "140px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted">
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.email}</td>
                                        <td>{user.gender=== "male" ? "Nam" : "Nữ"}</td>
                                        <td>{user.birthday}</td>
                                        <td>{user.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleUpdateUser(user)}
                                                className="me-2"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.user_id)}
                                            >
                                                Xoá
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
