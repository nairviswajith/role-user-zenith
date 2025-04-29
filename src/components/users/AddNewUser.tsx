
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  createUser, 
  getRolesCount, 
  getAllRoles,
  Role, 
  User,
  RoleType,
  getAllUsers
} from '../../lib/db';
import Pagination from '../ui/table/Pagination';
import { toast } from "@/components/ui/sonner";

const countryCodes = [
  '+91', '+1', '+44', '+81', '+61', '+7', '+49', '+33', '+86'
];

const AddNewUser: React.FC = () => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  
  // UI state
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [recentlyInvitedUsers, setRecentlyInvitedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedUsers, setTotalInvitedUsers] = useState(0);

  const usersPerPage = 10;

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const count = await getRolesCount();
        const roles = await getAllRoles(1, count);
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Failed to load roles:', error);
        toast.error('Failed to load roles');
      }
    };
    
    const loadRecentUsers = async () => {
      try {
        const users = await getAllUsers();
        setRecentlyInvitedUsers(users);
        setTotalInvitedUsers(users.length);
      } catch (error) {
        console.error('Failed to load recent users:', error);
      }
    };
    
    loadRoles();
    loadRecentUsers();
  }, []);

  const handleCountryCodeSelect = (code: string) => {
    setCountryCode(code);
    setCountryCodeOpen(false);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
  };

  const filteredRoles = availableRoles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = () => {
    if (!firstName || !selectedRole || !email || !mobile) {
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    try {
      const newUser: Omit<User, 'id' | 'createdAt'> = {
        firstName,
        lastName: lastName || '',
        roleId: selectedRole!.id,
        roleName: selectedRole!.name,
        roleType: selectedRole!.type as RoleType,
        email,
        countryCode,
        mobile,
        active: true
      };
      
      await createUser(newUser);
      
      toast.success('User invited successfully');
      
      // Update recently invited users
      const users = await getAllUsers();
      setRecentlyInvitedUsers(users);
      setTotalInvitedUsers(users.length);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setSelectedRole(null);
      setEmail('');
      setMobile('');
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const paginatedUsers = recentlyInvitedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              *First Name
            </label>
            <input
              type="text"
              placeholder="Enter here"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter here"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              *Assign Role
            </label>
            <div className="relative">
              <div 
                className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              >
                <span className={selectedRole ? '' : 'text-gray-400'}>
                  {selectedRole ? selectedRole.name : 'Search and select'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </div>
              
              {roleDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="p-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5"
                      placeholder="Search roles..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredRoles.map(role => (
                      <div
                        key={role.id}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role.name} ({role.type})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              *Email Address
            </label>
            <input
              type="email"
              placeholder="Enter here"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              *Country Code & Mobile Number
            </label>
            <div className="flex">
              <div className="relative w-24">
                <div 
                  className="w-full border border-gray-300 rounded-l-md px-3 py-2 flex items-center justify-between cursor-pointer"
                  onClick={() => setCountryCodeOpen(!countryCodeOpen)}
                >
                  <span>{countryCode}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                
                {countryCodeOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {countryCodes.map(code => (
                      <div
                        key={code}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCountryCodeSelect(code)}
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                type="tel"
                placeholder="Enter here"
                className="flex-1 border border-gray-300 rounded-r-md px-3 py-2"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Send Invite
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center my-6">
          <h2 className="text-lg font-medium text-gray-900">Recently Invited Users - {totalInvitedUsers}</h2>
          
          <div className="flex items-center">
            <input
              type="text"
              className="border rounded-md px-3 py-1.5 w-52 mr-2"
              placeholder="Search here"
            />
            
            <button 
              className="bg-primary text-white rounded-md px-4 py-1.5"
              onClick={() => toast.info('Search functionality for recent users')}
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
                <th className="table-header">Name</th>
                <th className="table-header">Role Name</th>
                <th className="table-header">Role Type</th>
                <th className="table-header">Email Address</th>
              </tr>
            </thead>
            <tbody>
              {recentlyInvitedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">No users invited yet</td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
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
        
        {totalInvitedUsers > usersPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalInvitedUsers / usersPerPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AddNewUser;
