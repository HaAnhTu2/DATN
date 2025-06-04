import React, { useEffect, useState } from "react";
import Home from "../../../components/sections/user/Home/page";
import { Category } from "../../../types/category";
import { getCategories } from "../../../services/categoryService";
import { Link, useNavigate } from "react-router-dom";

const UserHomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const imageList = ["shop03.png", "shop02.png", "shop01.png"]; // ảnh cố định

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    }
    fetchCategory();
  }, [navigate]);

  return (
    <div>
      <div className="section">
        <div className="container">
          <div className="row">
            {categories.slice(0, 3).map((category, index) => (
              <div key={category.category_id} className="col-md-4 col-xs-6">
                <div className="shop">
                  <Link
                    to={`/category/${category.category_id}`}
                  >
                  <div className="shop-img">
                    <img src={`./src/assets/img/${imageList[index % imageList.length]}`} alt={category.name} />
                  </div>
                  <div className="shop-body">
                    <h3>Bộ sưu tập<br />{category.name}</h3>
                    <Link
                      to={`/category/${category.category_id}`}
                      className="cta-btn"
                    >
                      Mua ngay <i className="fa fa-arrow-circle-right"></i>
                    </Link>
                  </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm</h3>
                <div className="section-nav">
                  <ul className="section-tab-nav tab-nav">
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab1" className="tab-pane active">
                    <div className="products-slick" data-nav="#slick-nav-1">
                      <Home />
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

export default UserHomePage;