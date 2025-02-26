import React from 'react';
import { AlertTriangle, Droplet, Wheat, LineChart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface WarningLabelProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
}

const WarningLabel: React.FC<WarningLabelProps> = ({ type, size = 'medium' }) => {
  const { t } = useTranslation();
  
  // Determine icon and label text based on warning type
  const getWarningConfig = () => {
    switch (type) {
      case 'warningHighSugar':
        return {
          icon: <Droplet size={iconSize} />,
          text: t('warningHighSugar'),
          color: 'bg-red-600'
        };
      case 'warningHighCarbs':
        return {
          icon: <Wheat size={iconSize} />,
          text: t('warningHighCarbs'),
          color: 'bg-orange-600'
        };
      case 'warningLowFiber':
        return {
          icon: <Wheat size={iconSize} strokeWidth={1} />,
          text: t('warningLowFiber'),
          color: 'bg-amber-600'
        };
      case 'warningPoorRatio':
        return {
          icon: <LineChart size={iconSize} />,
          text: t('warningPoorRatio'),
          color: 'bg-yellow-600'
        };
      default:
        return {
          icon: <AlertTriangle size={iconSize} />,
          text: t(type),
          color: 'bg-black'
        };
    }
  };
  
  // Determine size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-1.5 rounded-lg',
          text: 'text-xs',
          iconSize: 14
        };
      case 'large':
        return {
          container: 'p-3 rounded-xl',
          text: 'text-sm',
          iconSize: 24
        };
      default: // medium
        return {
          container: 'p-2 rounded-lg',
          text: 'text-xs',
          iconSize: 18
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const { container, text: textSize, iconSize } = sizeStyles;
  const { icon, text, color } = getWarningConfig();
  
  return (
    <div className={`${color} text-white ${container} flex flex-col items-center`}>
      <div className="rounded-full bg-black p-1.5 mb-1">
        {icon}
      </div>
      <span className={`${textSize} font-bold text-center`}>{text}</span>
    </div>
  );
};

export default WarningLabel;