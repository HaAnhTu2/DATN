import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByToken } from '../../services/authService';
import { User } from '../../types/user';

const Navigation: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const fetchedUser = await getUserByToken(token);
                setUser(fetchedUser.user);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <nav id="navigation">
            <div className="container">
                <div id="responsive-nav">
                    <ul className="main-nav nav navbar-nav">
                        <li><Link to="/home">UserHome</Link></li>
                        {user?.Role === 'admin' && (
                            <>
                                <li><Link to="/update/user">User Management</Link></li>
                                <li><Link to="/update/product">Product Management</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
