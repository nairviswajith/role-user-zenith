
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Roles pages
import RolesPage from "./pages/roles/RolesPage";
import ExistingRolesPage from "./pages/roles/ExistingRolesPage";
import AddRolePage from "./pages/roles/AddRolePage";

// Users pages
import UsersPage from "./pages/users/UsersPage";
import ExistingUsersPage from "./pages/users/ExistingUsersPage";
import AddUserPage from "./pages/users/AddUserPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* User Management - Roles */}
            <Route path="/user-management/roles" element={<RolesPage />}>
              <Route index element={<ExistingRolesPage />} />
              <Route path="add" element={<AddRolePage />} />
            </Route>
            
            {/* User Management - Users */}
            <Route path="/user-management/users" element={<UsersPage />}>
              <Route index element={<ExistingUsersPage />} />
              <Route path="add" element={<AddUserPage />} />
            </Route>
            
            {/* Redirect /user-management to /user-management/roles */}
            <Route 
              path="/user-management" 
              element={<Navigate to="/user-management/roles" replace />} 
            />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
