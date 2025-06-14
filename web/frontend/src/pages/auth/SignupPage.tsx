import React, { useState } from "react";
import Signup from "../../components/sections/auth/Signup";
import { User } from "../../types/user";

const SignupPage: React.FC = () => {
    const [, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState('')
    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Signup setUsers={setUsers} setMessage={setMessage} />
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </header>
        </div>
    )
}

export default SignupPage;