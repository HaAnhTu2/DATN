import React from "react";
import ProducerCreate from "../../../../components/sections/admin/Producer/create/page";

const CreateproducerPage: React.FC = () => {

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ProducerCreate />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CreateproducerPage;