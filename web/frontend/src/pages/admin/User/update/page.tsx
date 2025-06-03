import React from "react";
import { useParams } from "react-router-dom";
import UserUpdate from "../../../../components/sections/admin/User/update/[id]/page";

const UpdateUserPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <UserUpdate id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateUserPage;