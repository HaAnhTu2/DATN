import React from 'react';
import VoucherManagement from '../../../components/sections/admin/Voucher/page';

const VoucherManagementPage: React.FC = () => {
  return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <VoucherManagement />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
  };

export default VoucherManagementPage;