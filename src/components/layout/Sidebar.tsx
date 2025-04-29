
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Navigation, 
  ScrollText,
  MapPin,
  Map
} from 'lucide-react';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
  children?: { title: string; path: string }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: Users,
    children: [
      { title: 'Roles', path: '/user-management/roles' },
      { title: 'Users', path: '/user-management/users' }
    ]
  },
  {
    title: 'Date Setup',
    path: '/date-setup',
    icon: Settings
  },
  {
    title: 'Add Route',
    path: '/add-route',
    icon: Navigation
  },
  {
    title: 'Add Trip',
    path: '/add-trip',
    icon: ScrollText
  },
  {
    title: 'Route Monitoring',
    path: '/route-monitoring',
    icon: MapPin
  },
  {
    title: 'Live Tracking',
    path: '/live-tracking',
    icon: Map
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    '/user-management': true // Default expand User Management
  });

  const toggleItem = (path: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-60 min-h-screen bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <p className="text-gray-500 text-sm">User Panel</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <div>
                  <div 
                    className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => toggleItem(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  
                  {expandedItems[item.path] && (
                    <div className="mt-1">
                      {item.children.map(child => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`sidebar-item-child ${isActive(child.path) ? 'active' : ''}`}
                        >
                          <Users className="h-5 w-5" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
