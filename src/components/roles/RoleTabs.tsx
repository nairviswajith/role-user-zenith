
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: 'existing', label: 'Existing Roles' },
  { id: 'add', label: 'Add New Role' }
];

const RoleTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.includes('add') ? 'add' : 'existing';

  const handleTabClick = (tabId: string) => {
    if (tabId === 'existing') {
      navigate('/user-management/roles');
    } else {
      navigate('/user-management/roles/add');
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleTabs;
