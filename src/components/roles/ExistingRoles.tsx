
import React, { useState, useEffect } from 'react';
import { Eye, Pencil, ChevronDown } from 'lucide-react';
import { 
  getAllRoles, 
  getRolesCount, 
  Role, 
  subscribeToChanges,
  searchRoles
} from '../../lib/db';
import Pagination from '../ui/table/Pagination';
import RoleViewModal from './RoleViewModal';
import { toast } from "@/components/ui/sonner";

const ExistingRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'type'>('name');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const rolesPerPage = 10;

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true);
        const count = await getRolesCount();
        setTotalRoles(count);
        
        const fetchedRoles = await getAllRoles(currentPage, rolesPerPage);
        setRoles(fetchedRoles);
      } catch (error) {
        console.error('Failed to load roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoles();
    
    // Subscribe to role changes
    const unsubscribe = subscribeToChanges('roles', (actionType, data) => {
      if (actionType === 'add' || actionType === 'update') {
        loadRoles();
      }
    });
    
    return () => unsubscribe();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const fetchedRoles = await getAllRoles(currentPage, rolesPerPage);
      setRoles(fetchedRoles);
      return;
    }
    
    try {
      const results = await searchRoles(searchTerm, searchBy);
      setRoles(results);
      setTotalRoles(results.length);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    // For now just show a toast, in a real app would navigate to edit page
    toast.info(`Editing ${role.name}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-6">
        <h2 className="text-lg font-medium text-gray-900">Total Roles - {totalRoles}</h2>
        
        <div className="flex items-center">
          <div className="relative mr-2">
            <button
              className="flex items-center border rounded-md px-3 py-1.5 bg-white"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-sm">Search By</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-full">
                <div 
                  className="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearchBy('name');
                    setDropdownOpen(false);
                  }}
                >
                  Role Name
                </div>
                <div 
                  className="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearchBy('type');
                    setDropdownOpen(false);
                  }}
                >
                  Role Type
                </div>
              </div>
            )}
          </div>
          
          <input
            type="text"
            className="border rounded-md px-3 py-1.5 w-52"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <button 
            className="ml-2 bg-primary text-white rounded-md px-4 py-1.5"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="table-header">Creation Date</th>
              <th className="table-header">Role Name</th>
              <th className="table-header">Role Type</th>
              <th className="table-header">Take Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">Loading...</td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">No roles found</td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td className="table-cell">
                    {role.createdAt.toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })} {role.createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td className="table-cell">{role.name}</td>
                  <td className="table-cell">{role.type}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => handleViewRole(role)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => handleEditRole(role)}
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalRoles > rolesPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalRoles / rolesPerPage)}
          onPageChange={handlePageChange}
        />
      )}
      
      {selectedRole && (
        <RoleViewModal
          role={selectedRole}
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ExistingRoles;
