import React from 'react';

export interface Theme {
  id: string;
  name: string;
  previewBg: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: '默认',
    previewBg: 'bg-white',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'text-blue-600',
    fontFamily: 'font-sans',
  },
  {
    id: 'dark',
    name: '暗黑',
    previewBg: 'bg-gray-900',
    bgColor: 'bg-gray-900',
    textColor: 'text-gray-100',
    accentColor: 'text-blue-400',
    fontFamily: 'font-sans',
  },
  {
    id: 'purple',
    name: '紫色',
    previewBg: 'bg-purple-600',
    bgColor: 'bg-purple-600',
    textColor: 'text-gray-900',
    accentColor: 'text-purple-800',
    fontFamily: 'font-sans',
  },
  {
    id: 'elegant',
    name: '优雅',
    previewBg: 'bg-slate-50',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-800',
    accentColor: 'text-emerald-600',
    fontFamily: 'font-serif',
  },
  {
    id: 'vibrant',
    name: '活力',
    previewBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white',
    accentColor: 'text-yellow-300',
    fontFamily: 'font-sans',
  },
  {
    id: 'minimal',
    name: '极简',
    previewBg: 'bg-gray-50',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    accentColor: 'text-gray-600',
    fontFamily: 'font-mono',
  },
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onChange: (themeId: string) => void;
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onChange,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, themeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(themeId);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium">选择海报主题</label>
      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onChange(theme.id)}
            onKeyDown={(e) => handleKeyDown(e, theme.id)}
            tabIndex={0}
            aria-label={`选择${theme.name}主题`}
            className={`
              w-16 h-16 rounded-md cursor-pointer flex flex-col items-center justify-center transition-all
              ${theme.previewBg} border-2 hover:scale-105 
              ${selectedTheme === theme.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 dark:border-gray-700'}
            `}
            role="button"
          >
            <div className="text-xs font-medium" style={{ color: selectedTheme === theme.id ? '#3b82f6' : 'inherit' }}>
              {theme.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { themes };
export default ThemeSelector; 