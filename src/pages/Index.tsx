
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initDB } from '../lib/db';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setupDB = async () => {
      await initDB();
      // Redirect to dashboard after DB init
      navigate('/dashboard');
    };
    
    setupDB();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">User Management System</h1>
        <p className="text-xl text-gray-600">Initializing...</p>
      </div>
    </div>
  );
};

export default Index;
