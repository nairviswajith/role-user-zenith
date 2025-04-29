
import React from 'react';
import { X } from 'lucide-react';
import { Role } from '../../lib/db';

interface RoleViewModalProps {
  role: Role;
  open: boolean;
  onClose: () => void;
}

const RoleViewModal: React.FC<RoleViewModalProps> = ({ role, open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium">Role Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Role Name</p>
              <p className="font-medium">{role.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Role Type</p>
              <p className="font-medium">{role.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Creation Date</p>
              <p className="font-medium">
                {role.createdAt.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">Features</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {role.features
                  .filter(feature => feature.selected)
                  .map(feature => (
                    <div key={feature.id} className="bg-gray-100 rounded-md p-2">
                      {feature.name}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-3">Permissions</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left font-medium text-gray-600">Feature</th>
                    <th className="py-2 px-4 text-center font-medium text-gray-600">View</th>
                    <th className="py-2 px-4 text-center font-medium text-gray-600">Update</th>
                    <th className="py-2 px-4 text-center font-medium text-gray-600">Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {role.permissions.map(permission => {
                    const feature = role.features.find(f => f.id === permission.featureId);
                    if (!feature) return null;
                    
                    return (
                      <tr key={permission.featureId} className="border-t">
                        <td className="py-3 px-4">{feature.name}</td>
                        <td className="py-3 px-4 text-center">
                          {permission.view ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✕</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {permission.update ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✕</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {permission.alerts ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✕</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              className="btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleViewModal;
