import React, { FormEvent, useState } from 'react';
import { logout } from '../../api/api';

const Logout: React.FC = () => {
  const [, setError] = useState('');

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      setError('');
    } catch (error) {
      setError('Error logging out');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
};

export default Logout;
