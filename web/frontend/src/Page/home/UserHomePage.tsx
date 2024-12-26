import React, { useState } from "react";
import Home from "../../components/home/UserHome";
import { Product } from "../../type/product";

const UserHomePage: React.FC = () => {
  const [, setUserHome] = useState<Product | null>(null);

  return (
    <div>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src="./src/assets/img/shop01.png" alt="" />
                </div>
                <div className="shop-body">
                  <h3>Laptop<br />Collection</h3>
                  <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src="./src/assets/img/shop03.png" alt="" />
                </div>
                <div className="shop-body">
                  <h3>Accessories<br />Collection</h3>
                  <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src="./src/assets/img/shop02.png" alt="shop2" />
                </div>
                <div className="shop-body">
                  <h3>Cameras<br />Collection</h3>
                  <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Products</h3>
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
                      <Home setUserHome={setUserHome} />
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
              <div className="newsletter">
                <p>Sign Up for the <strong>NEWSLETTER</strong></p>
                <form>
                  <input className="input" type="email" placeholder="Enter Your Email" />
                  <button className="newsletter-btn"><i className="fa fa-envelope"></i> Subscribe</button>
                </form>
                <ul className="newsletter-follow">
                  <li>
                    <a href="#"><i className="fa fa-facebook"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="fa fa-twitter"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="fa fa-instagram"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="fa fa-pinterest"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;