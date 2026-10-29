// Muestra el logotipo original de Casa Tikkun desde public/Images.
import React from 'react';

interface TikkunLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'sage' | 'on-sage';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'circle' | 'square';
  tikkunColor?: string;
}

export const TikkunLogo: React.FC<TikkunLogoProps> = ({
  className = '',
  size = 'md',
  shape = 'rounded'
}) => {
  const dimensions = shape === 'circle'
    ? { sm: 'w-12 h-12', md: 'w-14 h-14', lg: 'w-16 h-16' }
    : shape === 'square'
      ? { sm: 'w-12 h-12', md: 'w-14 h-14', lg: 'w-16 h-16' }
    : { sm: 'w-24 h-12', md: 'w-32 h-16', lg: 'w-40 h-20' };

  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-md' : 'rounded-lg';

  return (
    <span className={`inline-flex shrink-0 overflow-hidden ${shapeClass} bg-tikkun-brand-sage ${dimensions[size]} ${className}`}>
      <img
        src="/Images/Logo.jpeg"
        alt="Casa Tikkun"
        className={`h-full w-full object-cover object-center mix-blend-multiply ${shape === 'circle' ? 'scale-150' : ''}`}
      />
    </span>
  );
};
