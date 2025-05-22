import React from 'react';
import ProducerManagement from '../../../components/sections/admin/Producer/page';

const ProducerManagementPage: React.FC = () => {
  return (
        <div className="section">
            <header className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <ProducerManagement />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
  };

export default ProducerManagementPage;