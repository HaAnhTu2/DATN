import React from 'react';
import OrderManagement from '../../../components/sections/admin/Order/page';

const OrderManagementPage: React.FC = () => {
  return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <OrderManagement />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
  };

export default OrderManagementPage;