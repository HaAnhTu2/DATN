import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
	return <>
		<nav id="navigation">
			<div className="container">
				<div id="responsive-nav">
					<ul className="main-nav nav navbar-nav">
						<li className="active"><Link to="/">Home</Link></li>
						<li><Link to="/home">UserHome</Link></li>
						<li><Link to="/create/user">Create User</Link></li>
						<li><Link to="/update/user">Edit User</Link></li>
						<li><Link to="/create/product">Create Product</Link></li>
						<li><Link to="/update/product">Edit Product</Link></li>
						<li><Link className="nav-link" to="/signup">Signup</Link></li>
						<li><Link className="nav-link" to="/login">Login</Link></li>
					</ul>
				</div>
			</div>
		</nav>
	</>
}
export default Navigation;