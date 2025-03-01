import React, { useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { debounce } from 'lodash';

interface ExportButtonProps {
  targetElementId: string;
  fileName?: string;
  className?: string;
}

type ExportFormat = 'png' | 'jpeg';

const ExportButton: React.FC<ExportButtonProps> = ({
  targetElementId,
  fileName = 'markdown-poster',
  className = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('png');

  const handleExport = debounce(async () => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      console.error(`找不到ID为 ${targetElementId} 的元素`);
      return;
    }

    try {
      setIsExporting(true);
      
      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(element, { quality: 0.95 });
      } else {
        dataUrl = await toJpeg(element, { quality: 0.95 });
      }
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `${fileName}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
    } finally {
      setIsExporting(false);
    }
  }, 300);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleExport();
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium">导出格式：</span>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="format"
            value="png"
            checked={format === 'png'}
            onChange={() => setFormat('png')}
            className="w-4 h-4"
          />
          <span className="text-sm">PNG</span>
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="format"
            value="jpeg"
            checked={format === 'jpeg'}
            onChange={() => setFormat('jpeg')}
            className="w-4 h-4"
          />
          <span className="text-sm">JPEG</span>
        </label>
      </div>
      <button
        onClick={handleExport}
        onKeyDown={handleKeyDown}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        tabIndex={0}
        aria-label="导出海报为图片"
      >
        {isExporting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            正在导出...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出为图片
          </span>
        )}
      </button>
    </div>
  );
};

export default ExportButton; 