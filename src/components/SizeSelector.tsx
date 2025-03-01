import React from 'react';

export interface Size {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

const sizes: Size[] = [
  {
    id: 'instagram',
    name: '朋友圈',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
  },
  {
    id: 'weibo',
    name: '微博',
    width: 1200,
    height: 600,
    aspectRatio: '2:1',
  },
  {
    id: 'a4',
    name: 'A4',
    width: 1240,
    height: 1754,
    aspectRatio: '1:√2',
  },
  {
    id: 'custom',
    name: '自定义',
    width: 1000,
    height: 800,
    aspectRatio: '自定义',
  },
];

interface SizeSelectorProps {
  selectedSize: string;
  onChange: (sizeId: string) => void;
  onCustomChange?: (width: number, height: number) => void;
  className?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSize,
  onChange,
  onCustomChange,
  className = '',
}) => {
  const handleSizeSelect = (sizeId: string) => {
    onChange(sizeId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, sizeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(sizeId);
    }
  };

  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    const selectedSizeObj = sizes.find(size => size.id === selectedSize);
    
    if (!isNaN(width) && width > 0 && selectedSizeObj && onCustomChange) {
      onCustomChange(width, selectedSizeObj.height);
    }
  };

  const handleCustomHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value, 10);
    const selectedSizeObj = sizes.find(size => size.id === selectedSize);
    
    if (!isNaN(height) && height > 0 && selectedSizeObj && onCustomChange) {
      onCustomChange(selectedSizeObj.width, height);
    }
  };

  const selectedSizeObj = sizes.find(size => size.id === selectedSize);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium">选择海报尺寸</label>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <div
            key={size.id}
            onClick={() => handleSizeSelect(size.id)}
            onKeyDown={(e) => handleKeyDown(e, size.id)}
            tabIndex={0}
            aria-label={`选择${size.name}尺寸`}
            className={`
              cursor-pointer px-3 py-2 rounded-md text-sm flex flex-col items-center justify-center transition-all
              hover:bg-gray-100 dark:hover:bg-gray-800
              ${selectedSize === size.id 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                : 'bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}
            `}
            role="button"
          >
            <div className="font-medium">{size.name}</div>
            <div className="text-xs opacity-70">{size.aspectRatio}</div>
          </div>
        ))}
      </div>

      {selectedSizeObj && (
        <div className="pt-2 flex flex-wrap gap-4">
          <div>
            <label htmlFor="width" className="block text-xs font-medium mb-1">宽度 (px)</label>
            <input
              id="width"
              type="number"
              min="100"
              max="3000"
              value={selectedSizeObj.width}
              onChange={handleCustomWidthChange}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              disabled={selectedSize !== 'custom'}
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-xs font-medium mb-1">高度 (px)</label>
            <input
              id="height"
              type="number"
              min="100"
              max="3000"
              value={selectedSizeObj.height}
              onChange={handleCustomHeightChange}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              disabled={selectedSize !== 'custom'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { sizes };
export default SizeSelector; 