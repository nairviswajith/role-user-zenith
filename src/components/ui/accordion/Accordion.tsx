
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  children,
  isOpen = false,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const expanded = onToggle ? isOpen : isExpanded;
  
  return (
    <div className="mb-4">
      <div 
        className="accordion-header"
        onClick={handleToggle}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {expanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
      
      {expanded && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps> | React.ReactElement<AccordionItemProps>[];
  allowMultiple?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ children, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);
  
  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index) 
          : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => 
        prev.includes(index) && prev.length === 1
          ? []
          : [index]
      );
    }
  };
  
  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen: openIndexes.includes(index),
            onToggle: () => handleToggle(index)
          });
        }
        return child;
      })}
    </div>
  );
};

export default Accordion;
