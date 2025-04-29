
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserTabs from '../../components/users/UserTabs';

const UsersPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <UserTabs />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersPage;
