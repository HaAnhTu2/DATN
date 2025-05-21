import React from "react";
import CategoryManagement from "../../../components/sections/admin/Category/page";

const CategoryManagementPage: React.FC = () => {

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <CategoryManagement />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CategoryManagementPage;