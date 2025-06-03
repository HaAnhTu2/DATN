import React from "react";
import { useParams } from "react-router-dom";
import CategoryUpdate from "../../../../components/sections/admin/Category/update/page";

const UpdateCategoryPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CategoryUpdate id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateCategoryPage;