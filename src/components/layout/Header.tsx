
import React from 'react';
import { Bell, AlertTriangle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b w-full">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <img src="https://placehold.co/32x32/0057B8/ffffff?text=S" alt="SNRAS Logo" className="h-8 w-8 mr-2" />
            <img src="https://placehold.co/32x32/6B7280/ffffff?text=F" alt="FM Plate Logo" className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-gray-700">Hello Jon,</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Fish groups, Trip IDs, Vehicle..."
              className="border rounded-md pl-10 pr-4 py-1.5 w-64 bg-gray-50"
            />
            <div className="absolute left-3 top-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-2">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
            </div>
            <AlertTriangle className="h-5 w-5 text-gray-500 mr-2" />
            <div className="h-8 w-8 bg-gray-200 rounded-full overflow-hidden">
              <img
                src="https://placehold.co/32x32/183B7E/ffffff?text=J"
                alt="User profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
