import React from "react";
import { useParams } from "react-router-dom";
import UserDetailUpdate from "../../../components/sections/user/User/page";

const UpdateUserDetailPage: React.FC = () => {
    const { id } = useParams();
    console.log("ID từ URL:", id); // kiểm tra ở đây

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <UserDetailUpdate id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateUserDetailPage;