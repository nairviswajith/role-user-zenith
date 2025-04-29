
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-lg">Welcome to the User Management System</p>
        <p className="text-gray-600 mt-2">
          Navigate to User Management section to manage users and roles
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
