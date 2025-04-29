
import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleTabs from '../../components/roles/RoleTabs';

const RolesPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <RoleTabs />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default RolesPage;
