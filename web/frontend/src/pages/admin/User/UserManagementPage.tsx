import React from "react";
import UserManagement from "../../../components/sections/admin/User/page";

const UserManagementPage: React.FC = () => {

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <UserManagement />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UserManagementPage;