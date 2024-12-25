import React, {useState} from "react";
import CreateFormUser from "../../components/sections/dashboard/user/Create";
import { User } from "../../type/user";

const CreateUserPage: React.FC=()=>{
    const [,setUsers]=useState<User[]>([]);
    const [message, setMessage]= useState('')
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                <CreateFormUser setUsers={setUsers} setMessage={setMessage}/>
                {message &&<p>{message}</p>}
                </div>
                </div>
            </header>
        </div>
    )
}

export default CreateUserPage;