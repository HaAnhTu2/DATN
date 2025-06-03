import React from "react";
import { useParams } from "react-router-dom";
import ProducerUpdate from "../../../../components/sections/admin/Producer/update/page";

const UpdateProducerPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ProducerUpdate id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateProducerPage;