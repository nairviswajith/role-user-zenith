
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  User, 
  getAllUsers, 
  getUsersCount, 
  updateUser,
  subscribeToChanges,
  searchUsers
} from '../../lib/db';
import Pagination from '../ui/table/Pagination';
import { toast } from "@/components/ui/sonner";

const ExistingUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'role' | 'email'>('name');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const usersPerPage = 10;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const count = await getUsersCount();
        setTotalUsers(count);
        
        const fetchedUsers = await getAllUsers(currentPage, usersPerPage);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
    
    // Subscribe to user changes
    const unsubscribe = subscribeToChanges('users', (actionType, data) => {
      if (actionType === 'add' || actionType === 'update') {
        loadUsers();
      }
    });
    
    return () => unsubscribe();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const fetchedUsers = await getAllUsers(currentPage, usersPerPage);
      setUsers(fetchedUsers);
      return;
    }
    
    try {
      const results = await searchUsers(searchTerm, searchBy);
      setUsers(results);
      setTotalUsers(results.length);
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

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllSelection = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      const updatedUser = {
        ...user,
        active: !user.active
      };
      
      await updateUser(updatedUser);
      setUsers(prev => 
        prev.map(u => u.id === user.id ? updatedUser : u)
      );
      
      toast.success(`User status updated to ${updatedUser.active ? 'active' : 'inactive'}`);
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleInactivate = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    try {
      const updatedUsers = users
        .filter(user => selectedUsers.includes(user.id))
        .map(user => ({ ...user, active: false }));
      
      await Promise.all(updatedUsers.map(user => updateUser(user)));
      
      setUsers(prev => 
        prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, active: false }
            : user
        )
      );
      
      toast.success(`${selectedUsers.length} users inactivated`);
    } catch (error) {
      console.error('Failed to inactivate users:', error);
      toast.error('Failed to inactivate users');
    }
  };

  const handleActivate = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    try {
      const updatedUsers = users
        .filter(user => selectedUsers.includes(user.id))
        .map(user => ({ ...user, active: true }));
      
      await Promise.all(updatedUsers.map(user => updateUser(user)));
      
      setUsers(prev => 
        prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, active: true }
            : user
        )
      );
      
      toast.success(`${selectedUsers.length} users activated`);
    } catch (error) {
      console.error('Failed to activate users:', error);
      toast.error('Failed to activate users');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center my-6">
        <h2 className="text-lg font-medium text-gray-900">Total Users - {totalUsers}</h2>
        
        <div className="flex items-center">
          <div className="mr-2">
            <button 
              className="border border-gray-300 bg-white text-gray-700 px-4 py-1.5 rounded-md"
              onClick={handleInactivate}
            >
              Inactive
            </button>
          </div>
          
          <div className="mr-2">
            <button 
              className="bg-primary text-white px-4 py-1.5 rounded-md"
              onClick={handleActivate}
            >
              Active
            </button>
          </div>
          
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
                  Name
                </div>
                <div 
                  className="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearchBy('role');
                    setDropdownOpen(false);
                  }}
                >
                  Role
                </div>
                <div 
                  className="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearchBy('email');
                    setDropdownOpen(false);
                  }}
                >
                  Email
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
              <th className="table-header w-10">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(e) => toggleAllSelection(e.target.checked)}
                />
              </th>
              <th className="table-header">Creation Date</th>
              <th className="table-header">Name</th>
              <th className="table-header">Role Name</th>
              <th className="table-header">Role Type</th>
              <th className="table-header">Email Address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  className={`${selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td className="table-cell">
                    {user.createdAt.toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })} {user.createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td className="table-cell">{user.firstName} {user.lastName}</td>
                  <td className="table-cell">{user.roleName}</td>
                  <td className="table-cell">{user.roleType}</td>
                  <td className="table-cell">{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalUsers > usersPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalUsers / usersPerPage)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ExistingUsers;
