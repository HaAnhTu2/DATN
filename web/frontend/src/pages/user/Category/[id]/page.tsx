import React from "react";
import ProductCategory from "../../../../components/sections/user/Category/[id]/page";
import { useParams } from "react-router-dom";

const CategoryPage: React.FC = () => {
    const { id } = useParams();

    return (
        <div>
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="products-tabs">
                                    <div id="tab1" className="tab-pane active">
                                        <div className="products-slick" data-nav="#slick-nav-1">
                                            <ProductCategory id={id ?? ""} />
                                        </div>
                                        <div id="slick-nav-1" className="products-slick-nav"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="newsletter" className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;