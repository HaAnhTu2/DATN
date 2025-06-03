import React from "react";
import { useParams } from "react-router-dom";
import VoucherUpdate from "../../../../components/sections/admin/Voucher/update/page";

const UpdateVoucherPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <VoucherUpdate id={id ?? ""}  />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default UpdateVoucherPage;