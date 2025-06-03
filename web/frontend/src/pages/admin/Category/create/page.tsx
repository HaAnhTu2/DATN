import React from "react";
import CategoryCreate from "../../../../components/sections/admin/Category/create/page";

const CreateCategoryPage: React.FC = () => {

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CategoryCreate />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CreateCategoryPage;