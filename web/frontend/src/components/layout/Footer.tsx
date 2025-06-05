import React, { useEffect, useState } from 'react';
import { Category } from '../../types/category';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { User } from '../../types/user';
import { getUserByToken } from '../../services/authService';

const Footer: React.FC = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [user, setUser] = useState<User | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategory = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				console.error('No token found');
				return;
			}
			try {
				const fetchedCategories = await getCategories();
				setCategories(fetchedCategories);
				const fetchedUser = await getUserByToken(token);
				setUser(fetchedUser.user);
			} catch (error) {
				console.error('Failed to fetch user:', error);
			}
		};
		fetchCategory();
	}, [navigate]);
	const handleCartClick = () => {
    if (!user) {
      console.error('User not found. Redirecting to login.');
      navigate('/login');
      return;
    }
    navigate(`/cart/${user.user_id}`);
  };
	return <>
		<footer id="footer">
			<div className="section">
				<div className="container">
					<div className="row">
						<div className="col-md-3 col-xs-6">
							<div className="footer">
								<h3 className="footer-title">Về chúng tôi</h3>
								<p>Web bán đồ điện tử Eletro. bán mọi thể loại điện tử</p>
								<ul className="footer-links">
									<li><a href="#"><i className="fa fa-map-marker"></i>Tây Tựu, Bắc Từ Liêm, Hà Nội</a></li>
									<li><a href="#"><i className="fa fa-phone"></i>+123-45-67-89</a></li>
									<li><a href="#"><i className="fa fa-envelope-o"></i>Tusha123@email.com</a></li>
								</ul>
							</div>
						</div>

						<div className="col-md-3 col-xs-6">
							<div className="footer">
								<h3 className="footer-title">Loại sản phẩm</h3>
								<ul className="footer-links">
									{categories.map((category) => (
										<li key={category.category_id}>
											<Link
												to={`/category/${category.category_id}`}
												className="text-decoration-none"
											>
												{category.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="clearfix visible-xs"></div>

						<div className="col-md-3 col-xs-6">
							<div className="footer">
								<h3 className="footer-title">Dịch vụ</h3>
								<ul className="footer-links">
									<li><Link to={`/user/${user?.user_id}`} className='text-decoration-none'> Tài khoản của tôi</Link></li>
									<li><Link to={`/cart/${user?.user_id}`} className='text-decoration-none' onClick={handleCartClick}> Giỏ hàng</Link></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div id="bottom-footer" className="section">
				<div className="container">
					<div className="row">
						<div className="col-md-12 text-center">
							<span className="copyright">
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	</>
};

export default Footer;
