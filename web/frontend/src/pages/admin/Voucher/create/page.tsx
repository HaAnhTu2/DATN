import React from "react";
import VoucherCreate from "../../../../components/sections/admin/Voucher/create/page";

const CreateVoucherPage: React.FC = () => {

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <VoucherCreate />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CreateVoucherPage;