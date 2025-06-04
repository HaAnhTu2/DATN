import React from "react";
import VoucherList from "../../../components/sections/user/Voucher/page";

const VoucherPage: React.FC = () => {

    return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <VoucherList/>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default VoucherPage;