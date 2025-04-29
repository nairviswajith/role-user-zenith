
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Accordion, { AccordionItem } from '../ui/accordion/Accordion';
import { createRole, Feature, Permission, RoleType } from '../../lib/db';
import { toast } from "@/components/ui/sonner";

// Available features for roles
const availableFeatures: { id: string; name: string }[] = [
  { id: '1', name: 'Dashboard' },
  { id: '2', name: 'User Management' },
  { id: '3', name: 'Data Setup' },
  { id: '4', name: 'Add Route' },
  { id: '5', name: 'Add Trip' },
  { id: '6', name: 'Route Monitoring' },
  { id: '7', name: 'Live Tracking' },
];

// Available role types
const roleTypes = Object.values(RoleType);

const AddNewRole: React.FC = () => {
  // Active step (1, 2, or 3)
  const [activeStep, setActiveStep] = useState(1);
  
  // Form state for Role Creation step
  const [roleName, setRoleName] = useState('');
  const [roleType, setRoleType] = useState<RoleType | ''>('');
  const [roleTypeOpen, setRoleTypeOpen] = useState(false);
  
  // Form state for Feature Access step
  const [features, setFeatures] = useState<Feature[]>(
    availableFeatures.map(feature => ({ ...feature, selected: false }))
  );
  
  // Form state for Privilege Rights step
  const [permissions, setPermissions] = useState<Permission[]>(
    availableFeatures.map(feature => ({
      featureId: feature.id,
      view: false,
      update: false,
      alerts: false
    }))
  );

  // Handle role type selection
  const handleRoleTypeSelect = (type: RoleType) => {
    setRoleType(type);
    setRoleTypeOpen(false);
  };

  // Handle feature selection
  const handleFeatureToggle = (id: string) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === id 
          ? { ...feature, selected: !feature.selected }
          : feature
      )
    );
  };

  // Handle "Select All" features
  const handleSelectAllFeatures = (checked: boolean) => {
    setFeatures(prev => 
      prev.map(feature => ({ ...feature, selected: checked }))
    );
  };

  // Handle permission changes
  const handlePermissionChange = (
    featureId: string, 
    permissionType: 'view' | 'update' | 'alerts', 
    value: boolean
  ) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.featureId === featureId 
          ? { ...permission, [permissionType]: value }
          : permission
      )
    );
  };

  // Next step handler
  const handleNext = () => {
    if (activeStep === 1) {
      if (!roleName || !roleType) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      setActiveStep(2);
    } else if (activeStep === 2) {
      const selectedFeatures = features.filter(f => f.selected);
      if (selectedFeatures.length === 0) {
        toast.error('Please select at least one feature');
        return;
      }
      
      setActiveStep(3);
    }
  };

  // Submit form handler
  const handleSubmit = async () => {
    try {
      const selectedFeatureIds = features
        .filter(f => f.selected)
        .map(f => f.id);
      
      // Filter permissions to only selected features
      const rolePermissions = permissions.filter(p => 
        selectedFeatureIds.includes(p.featureId)
      );
      
      // Create new role
      const newRole = await createRole({
        name: roleName,
        type: roleType as RoleType,
        features: features.filter(f => f.selected),
        permissions: rolePermissions
      });
      
      toast.success('Role created successfully!');
      
      // Reset form
      setRoleName('');
      setRoleType('');
      setFeatures(availableFeatures.map(feature => ({ ...feature, selected: false })));
      setPermissions(availableFeatures.map(feature => ({
        featureId: feature.id,
        view: false,
        update: false,
        alerts: false
      })));
      setActiveStep(1);
    } catch (error) {
      console.error('Failed to create role:', error);
      toast.error('Failed to create role');
    }
  };

  return (
    <div>
      <Accordion>
        <AccordionItem 
          title="Role Creation" 
          isOpen={activeStep === 1}
        >
          <div className="mb-4">
            <p className="text-gray-600 mb-6">Select features to create roles</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  *Role Name
                </label>
                <input
                  type="text"
                  placeholder="Enter here"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  *Role Type
                </label>
                <div className="relative">
                  <div 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer"
                    onClick={() => setRoleTypeOpen(!roleTypeOpen)}
                  >
                    <span className={roleType ? '' : 'text-gray-400'}>
                      {roleType || 'Select here'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  
                  {roleTypeOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      {roleTypes.map(type => (
                        <div
                          key={type}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRoleTypeSelect(type)}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                className="btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </AccordionItem>
        
        <AccordionItem 
          title="Feature Access" 
          isOpen={activeStep === 2}
        >
          <div>
            <p className="text-gray-600 mb-6">Select features to assign per user role</p>
            
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="checkbox mr-3"
                  id="select-all"
                  checked={features.every(f => f.selected)}
                  onChange={(e) => handleSelectAllFeatures(e.target.checked)}
                />
                <label htmlFor="select-all" className="font-medium">
                  Select All
                </label>
              </div>
              
              {availableFeatures.map(feature => (
                <div key={feature.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    className="checkbox mr-3"
                    checked={features.find(f => f.id === feature.id)?.selected || false}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                  <label htmlFor={`feature-${feature.id}`}>
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                className="btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </AccordionItem>
        
        <AccordionItem 
          title="Privilege Rights" 
          isOpen={activeStep === 3}
        >
          <div>
            <p className="text-gray-600 mb-6">Select access type per feature for this role</p>
            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-4 w-1/4">Features</th>
                  <th className="text-center pb-4 w-1/4">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="checkbox mr-2"
                        id="view-all"
                        checked={permissions.every(p => 
                          !features.find(f => f.id === p.featureId)?.selected || p.view
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPermissions(prev => 
                            prev.map(permission => ({
                              ...permission,
                              view: checked
                            }))
                          );
                        }}
                      />
                      <label htmlFor="view-all">View</label>
                    </div>
                  </th>
                  <th className="text-center pb-4 w-1/4">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="checkbox mr-2"
                        id="update-all"
                        checked={permissions.every(p => 
                          !features.find(f => f.id === p.featureId)?.selected || p.update
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPermissions(prev => 
                            prev.map(permission => ({
                              ...permission,
                              update: checked
                            }))
                          );
                        }}
                      />
                      <label htmlFor="update-all">Update</label>
                    </div>
                  </th>
                  <th className="text-center pb-4 w-1/4">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="checkbox mr-2"
                        id="alerts-all"
                        checked={permissions.every(p => 
                          !features.find(f => f.id === p.featureId)?.selected || p.alerts
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPermissions(prev => 
                            prev.map(permission => ({
                              ...permission,
                              alerts: checked
                            }))
                          );
                        }}
                      />
                      <label htmlFor="alerts-all">Alerts</label>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.filter(f => f.selected).map(feature => {
                  const permission = permissions.find(p => p.featureId === feature.id) || {
                    featureId: feature.id,
                    view: false,
                    update: false,
                    alerts: false
                  };
                  
                  return (
                    <tr key={feature.id} className="border-t border-gray-200">
                      <td className="py-4">{feature.name}</td>
                      <td className="text-center py-4">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={permission.view}
                          onChange={(e) => 
                            handlePermissionChange(feature.id, 'view', e.target.checked)
                          }
                        />
                      </td>
                      <td className="text-center py-4">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={permission.update}
                          onChange={(e) => 
                            handlePermissionChange(feature.id, 'update', e.target.checked)
                          }
                        />
                      </td>
                      <td className="text-center py-4">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={permission.alerts}
                          onChange={(e) => 
                            handlePermissionChange(feature.id, 'alerts', e.target.checked)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div className="mt-6">
              <button
                className="btn-primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddNewRole;
