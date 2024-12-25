import React, {useEffect, useState} from "react";
import { deleteUser,getUsers } from "../../../../api/user";
import { User } from "../../../../type/user";
import {Row, Card, Table } from 'react-bootstrap';

interface UserListProps{
    setFormUser:(user:User)=>void;
}

const UserList:React.FC<UserListProps>=({setFormUser})=>{
    const [users,setUsers] =useState<User[]>([]);
    const [loading, setloading] = useState(true);
    useEffect(()=>{
        const fetchUsers= async()=>{
            try{
                const fetchedUsers =await getUsers();
                setUsers(fetchedUsers);
                setloading(false);
            }catch(error){
                console.error('error fetching users:',error);
                setloading(false);
            }
        };
        fetchUsers();
    },[]);
    if(loading){
        return <div>Loading...</div>;
    }
    const handleUpdateUser = (user:User)=>{
        setFormUser(user);
    };
    const handleDeleteUser =async (id: string)=>{
        try{
            await deleteUser(id)
            setUsers(users.filter(user=>user._id!=id))
        }catch(error){
            console.error('error deleting user:',error);
        }
    }
    return(
        <Row className="mt-6">
            <Card className="h-100">
            <div className="bg-white  py-4">
                <h4 className="mb-0">User</h4>
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
                {users.map(user=>(
                    <tr key={user._id}>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                        <td>
                        {user.userimage_url ? (
                  <img
                        src={`http://localhost:3000/image/${user.userimage_url}`}
                        alt={user.firstname + user.lastname}
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
export default UserList;