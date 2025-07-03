import React from 'react';
import MultiSelector from '../../common/multi-selector';

/**
 * ToolbarButton props for a single toolbar action.
 */
export interface ToolbarButtonProps {
  tooltip: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  dropdownContent?: React.ReactNode;
}

/**
 * Reusable toolbar button with tooltip, icon, label, and optional dropdown.
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  tooltip,
  icon,
  label,
  isActive,
  onClick,
  dropdownContent,
}) => (
  <MultiSelector
    tooltip={{ buttonTooltipContent: tooltip, side: 'bottom' }}
    dropdown={{ align: 'end', side: 'bottom' }}
    dropdowncontent={dropdownContent}
    onClick={onClick}
    isActive={isActive}
  >
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-sm hidden xxl:block pr-1">{label}</p>
    </div>
  </MultiSelector>
);

export default ToolbarButton;
