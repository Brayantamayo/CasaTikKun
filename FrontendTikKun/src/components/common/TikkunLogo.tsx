// Dibuja las variantes del logotipo y el emblema de Casa Tikkun.
import React from 'react';

interface TikkunLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'sage' | 'on-sage';
  size?: 'sm' | 'md' | 'lg';
  tikkunColor?: string;
}

export const TikkunLogo: React.FC<TikkunLogoProps> = ({
  className = '',
  variant = 'on-sage',
  size = 'md',
  tikkunColor
}) => {
  // Configuración de colores según la identidad visual de la marca.
  let defaultTikkunColor = '#1E311A';
  let treeColor = '#243C20';
  let subColor = '#2D4427';

  if (variant === 'light') {
    defaultTikkunColor = '#B8CFA0'; // Verde salvia de la marca.
    treeColor = '#CAD6B2';
    subColor = '#Dce5cb';
  } else if (variant === 'dark') {
    defaultTikkunColor = '#1E311A';
    treeColor = '#2C4425';
    subColor = '#3D5435';
  } else if (variant === 'on-sage') {
    defaultTikkunColor = '#142911';
    treeColor = '#243B1F';
    subColor = '#2D4428';
  }

  const finalTikkunColor = tikkunColor || defaultTikkunColor;

  const heights = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 280 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heights[size]} w-auto drop-shadow-xs`}
        aria-label="Casa Tikkun Logo"
      >
        {/* Árbol estilizado de la identidad visual. */}
        <g id="tree-canopy">
          {/* Tronco principal. */}
          <path
            d="M 52 74 C 53 58, 48 42, 54 28 C 56 22, 62 18, 70 16 C 85 14, 102 12, 120 14"
            stroke={treeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Rama que se curva sobre el nombre. */}
          <path
            d="M 68 22 C 86 16, 115 13, 150 18 C 175 22, 202 14, 218 8"
            stroke={treeColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 125 15 C 145 10, 172 11, 192 18 C 208 24, 225 21, 238 16"
            stroke={treeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 88 18 C 96 24, 110 26, 124 23"
            stroke={treeColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 160 17 C 170 24, 182 25, 195 22"
            stroke={treeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Grupos de hojas de trazo orgánico. */}
          {/* Grupo izquierdo. */}
          <ellipse cx="64" cy="18" rx="4.2" ry="2.8" transform="rotate(-30 64 18)" fill={treeColor} opacity="0.85" />
          <ellipse cx="73" cy="14" rx="4.6" ry="3.0" transform="rotate(15 73 14)" fill={treeColor} opacity="0.8" />
          <ellipse cx="82" cy="11" rx="4.0" ry="2.6" transform="rotate(-10 82 11)" fill={treeColor} opacity="0.85" />
          <ellipse cx="94" cy="13" rx="4.8" ry="3.1" transform="rotate(25 94 13)" fill={treeColor} opacity="0.9" />

          {/* Grupo central. */}
          <ellipse cx="108" cy="10" rx="4.5" ry="3.0" transform="rotate(-20 108 10)" fill={treeColor} opacity="0.8" />
          <ellipse cx="120" cy="8" rx="5.0" ry="3.2" transform="rotate(10 120 8)" fill={treeColor} opacity="0.95" />
          <ellipse cx="132" cy="11" rx="4.4" ry="2.8" transform="rotate(-15 132 11)" fill={treeColor} opacity="0.85" />
          <ellipse cx="144" cy="14" rx="5.2" ry="3.2" transform="rotate(30 144 14)" fill={treeColor} opacity="0.9" />
          <ellipse cx="156" cy="13" rx="4.6" ry="2.9" transform="rotate(-25 156 13)" fill={treeColor} opacity="0.85" />

          {/* Grupo de ramas derecho. */}
          <ellipse cx="170" cy="10" rx="4.8" ry="3.0" transform="rotate(20 170 10)" fill={treeColor} opacity="0.9" />
          <ellipse cx="184" cy="14" rx="4.4" ry="2.8" transform="rotate(-15 184 14)" fill={treeColor} opacity="0.85" />
          <ellipse cx="198" cy="12" rx="4.6" ry="2.9" transform="rotate(35 198 12)" fill={treeColor} opacity="0.95" />
          <ellipse cx="212" cy="10" rx="4.0" ry="2.5" transform="rotate(-10 212 10)" fill={treeColor} opacity="0.8" />
          <ellipse cx="224" cy="15" rx="4.2" ry="2.6" transform="rotate(25 224 15)" fill={treeColor} opacity="0.85" />
          <ellipse cx="236" cy="14" rx="3.6" ry="2.4" transform="rotate(-30 236 14)" fill={treeColor} opacity="0.75" />

          {/* Hojas pequeñas bajo el arco. */}
          <ellipse cx="78" cy="24" rx="3.2" ry="2.1" transform="rotate(45 78 24)" fill={treeColor} opacity="0.7" />
          <ellipse cx="112" cy="22" rx="3.5" ry="2.2" transform="rotate(-40 112 22)" fill={treeColor} opacity="0.75" />
          <ellipse cx="166" cy="22" rx="3.4" ry="2.2" transform="rotate(30 166 22)" fill={treeColor} opacity="0.75" />
          <ellipse cx="204" cy="22" rx="3.2" ry="2.0" transform="rotate(-25 204 22)" fill={treeColor} opacity="0.7" />
        </g>

        {/* Nombre de la marca con tipografía serif. */}
        <text
          x="36"
          y="56"
          fill={finalTikkunColor}
          fontFamily="'Fraunces', Georgia, serif"
          fontSize="43"
          fontWeight="600"
          letterSpacing="0.02em"
        >
          Tikkun
        </text>

        {/* Descriptor de la marca. */}
        <text
          x="42"
          y="73"
          fill={subColor}
          fontFamily="'Outfit', system-ui, sans-serif"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.32em"
        >
          CASA CAMPESTRE
        </text>
      </svg>
    </div>
  );
};

export interface TikkunEmblemProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const TikkunEmblem: React.FC<TikkunEmblemProps> = ({
  className = '',
  size = 36,
  color = '#1E311A',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
      aria-label="Casa Tikkun Emblem"
    >
      {/* Copa del árbol y ramas orgánicas. */}
      <g id="tikkun-tree-emblem">
        {/* Tronco curvo. */}
        <path
          d="M 50 88 C 51 68, 46 52, 52 36 C 54 30, 60 25, 68 23 C 78 20, 86 22, 91 26"
          stroke={color}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* Rama izquierda. */}
        <path
          d="M 52 42 C 38 34, 25 36, 14 42"
          stroke={color}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Rama derecha. */}
        <path
          d="M 60 30 C 72 24, 84 26, 92 34"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Rama secundaria. */}
        <path
          d="M 49 56 C 36 50, 26 53, 18 60"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Hojas del lado izquierdo. */}
        <ellipse cx="14" cy="42" rx="5.2" ry="3.4" transform="rotate(-25 14 42)" fill={color} opacity="0.9" />
        <ellipse cx="23" cy="37" rx="4.8" ry="3.2" transform="rotate(20 23 37)" fill={color} opacity="0.85" />
        <ellipse cx="32" cy="35" rx="4.4" ry="2.9" transform="rotate(-15 32 35)" fill={color} opacity="0.9" />
        <ellipse cx="18" cy="60" rx="4.8" ry="3.2" transform="rotate(30 18 60)" fill={color} opacity="0.85" />
        <ellipse cx="28" cy="52" rx="4.2" ry="2.8" transform="rotate(-20 28 52)" fill={color} opacity="0.8" />

        {/* Hojas de la parte superior y derecha. */}
        <ellipse cx="48" cy="22" rx="5.8" ry="3.6" transform="rotate(-10 48 22)" fill={color} opacity="0.95" />
        <ellipse cx="60" cy="18" rx="6.2" ry="4.0" transform="rotate(15 60 18)" fill={color} opacity="0.95" />
        <ellipse cx="72" cy="19" rx="5.8" ry="3.6" transform="rotate(-25 72 19)" fill={color} opacity="0.9" />
        <ellipse cx="83" cy="23" rx="5.2" ry="3.4" transform="rotate(25 83 23)" fill={color} opacity="0.9" />
        <ellipse cx="92" cy="34" rx="4.6" ry="3.0" transform="rotate(-15 92 34)" fill={color} opacity="0.85" />
      </g>

      {/* Inicial de la marca en tipografía serif. */}
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fill={color}
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="36"
        fontWeight="700"
        letterSpacing="0.02em"
      >
        T
      </text>
    </svg>
  );
};

