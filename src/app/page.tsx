'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';
import { sizes } from '@/components/SizeSelector';
import domtoimage from 'dom-to-image-more';

const defaultMarkdown = `# Markdown Poster

" *Markdown Poster* is a tool that allows you to create elegant graphic posters using Markdown. 🎨"

![](https://picsum.photos/800/300)

## Main features:

1. Convert Markdown to **graphic posters**
2. Customize text themes, backgrounds, and font sizes
3. Copy images to \`clipboard\` or \`download as PNG images\`
4. What you see is what you get
5. Free
6. Supports API calls, just register to get a free token.

## You can use it for:

1. Creating *briefings*
2. Creating *social media share images*
3. Creating *article posters*
4. Anything you want...
`;

// 本地存储键名常量
const STORAGE_KEYS = {
  MARKDOWN: 'markdown-poster-content',
  SIZE: 'markdown-poster-size',
  CUSTOM_SIZE: 'markdown-poster-custom-size'
};

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [size, setSize] = useState('instagram');
  const [customSize, setCustomSize] = useState({
    width: sizes.find(s => s.id === 'custom')?.width || 1000,
    height: sizes.find(s => s.id === 'custom')?.height || 800,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  // 从本地存储加载数据
  useEffect(() => {
    // 尝试从localStorage读取保存的markdown内容
    const savedMarkdown = localStorage.getItem(STORAGE_KEYS.MARKDOWN);
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    // 尝试从localStorage读取保存的尺寸设置
    const savedSize = localStorage.getItem(STORAGE_KEYS.SIZE);
    if (savedSize) {
      setSize(savedSize);
    }

    // 尝试从localStorage读取保存的自定义尺寸
    const savedCustomSize = localStorage.getItem(STORAGE_KEYS.CUSTOM_SIZE);
    if (savedCustomSize) {
      try {
        setCustomSize(JSON.parse(savedCustomSize));
      } catch (error) {
        console.error('无法解析保存的自定义尺寸:', error);
      }
    }
  }, []);

  // 当markdown内容变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKDOWN, markdown);
  }, [markdown]);

  // 当尺寸设置变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIZE, size);
  }, [size]);

  // 当自定义尺寸变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SIZE, JSON.stringify(customSize));
  }, [customSize]);

  // 获取当前尺寸对象
  const currentSize = sizes.find(s => s.id === size) || sizes[0];
  
  // 如果是自定义尺寸，使用自定义的宽高
  const posterWidth = size === 'custom' ? customSize.width : currentSize.width;
  
  // 设计者信息
  const designer = {
    name: "John Doe",
    title: "UI Designer"
  };

  const currentYear = new Date().getFullYear();

  // 显示通知
  const showNotificationMessage = (message: string, duration = 3000) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  // 下载海报函数 - 使用dom-to-image库
  const handleDownloadPoster = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 阻止默认行为，防止页面刷新
    e.preventDefault();
    
    if (!posterRef.current) {
      showNotificationMessage('找不到海报元素', 3000);
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // 获取预览区域内的海报元素
      const posterElement = posterRef.current;
      
      // 检查图片是否已全部加载完成
      const isImagesLoaded = posterElement.getAttribute('data-images-loaded') === 'true';
      if (!isImagesLoaded) {
        // 等待图片完全加载，最多等待5秒
        await new Promise((resolve) => {
          let checkCount = 0;
          const checkInterval = setInterval(() => {
            if (posterElement.getAttribute('data-images-loaded') === 'true' || checkCount > 50) {
              clearInterval(checkInterval);
              resolve(null);
            }
            checkCount++;
          }, 100);
        });
      }
      
      // 确保所有图片都已加载完成
      const images = posterElement.querySelectorAll('img');
      const imageLoadPromises = Array.from(images).map(
        img => 
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth !== 0) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => {
                console.warn(`图片加载失败: ${img.src}`);
                resolve(null);
              };
              // 如果图片已有src但未加载，尝试重新加载
              if (img.src) {
                const currentSrc = img.src;
                img.src = currentSrc + `?t=${Date.now()}`; // 添加时间戳避免缓存问题
              }
            }
          })
      );
      
      // 等待所有图片加载完成
      await Promise.all(imageLoadPromises);
      
      // 获取预览区域元素，它包含背景色等样式
      const previewContainer = previewRef.current;
      if (!previewContainer) {
        showNotificationMessage('找不到预览容器元素', 3000);
        return;
      }
      
      // 创建一个临时容器来复制整个预览区域，保留背景色和布局
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = `${previewContainer.offsetWidth}px`;
      tempContainer.style.height = `${previewContainer.offsetHeight}px`;
      tempContainer.style.overflow = 'hidden';
      tempContainer.style.display = 'flex';
      tempContainer.style.justifyContent = 'center';
      tempContainer.style.alignItems = 'center';
      
      // 复制预览区域的背景样式
      const previewComputedStyle = window.getComputedStyle(previewContainer);
      tempContainer.style.background = previewComputedStyle.background;
      tempContainer.style.backgroundImage = previewComputedStyle.backgroundImage;
      tempContainer.style.backgroundColor = previewComputedStyle.backgroundColor;
      tempContainer.style.padding = previewComputedStyle.padding;
      
      // 克隆海报元素
      const clonedPoster = posterElement.cloneNode(true) as HTMLElement;
      
      // 获取所有原始计算样式
      const originalComputedStyle = window.getComputedStyle(posterElement);
      
      // 保留所有关键样式，确保视觉效果一致
      clonedPoster.style.width = `${posterElement.offsetWidth}px`;
      clonedPoster.style.height = `${posterElement.offsetHeight}px`;
      clonedPoster.style.background = originalComputedStyle.background;
      clonedPoster.style.backgroundColor = originalComputedStyle.backgroundColor;
      clonedPoster.style.borderRadius = originalComputedStyle.borderRadius;
      clonedPoster.style.boxShadow = originalComputedStyle.boxShadow;
      clonedPoster.style.padding = originalComputedStyle.padding;
      clonedPoster.style.margin = '0';
      clonedPoster.style.transform = 'none';
      clonedPoster.style.border = originalComputedStyle.border;
      
      // 复制所有内部元素样式
      const copyComputedStyles = (sourceElement: HTMLElement, targetElement: HTMLElement) => {
        const computedStyle = window.getComputedStyle(sourceElement);
        
        // 复制关键样式
        targetElement.style.color = computedStyle.color;
        targetElement.style.backgroundColor = computedStyle.backgroundColor;
        targetElement.style.fontSize = computedStyle.fontSize;
        targetElement.style.fontFamily = computedStyle.fontFamily;
        targetElement.style.fontWeight = computedStyle.fontWeight;
        targetElement.style.lineHeight = computedStyle.lineHeight;
        targetElement.style.textAlign = computedStyle.textAlign;
        targetElement.style.margin = computedStyle.margin;
        targetElement.style.padding = computedStyle.padding;
        targetElement.style.borderRadius = computedStyle.borderRadius;
        targetElement.style.border = computedStyle.border;
        targetElement.style.boxShadow = computedStyle.boxShadow;
        
        // 如果是特定元素，复制更多关键样式
        if (sourceElement.tagName === 'IMG') {
          targetElement.style.width = computedStyle.width;
          targetElement.style.height = computedStyle.height;
          targetElement.style.objectFit = computedStyle.objectFit;
          targetElement.style.borderRadius = computedStyle.borderRadius;
        } else if (sourceElement.tagName === 'H1' || sourceElement.tagName === 'H2') {
          targetElement.style.fontWeight = computedStyle.fontWeight;
          targetElement.style.margin = computedStyle.margin;
        } else if (sourceElement.classList.contains('border-l-4')) {
          // 确保引用样式正确
          targetElement.style.borderLeft = computedStyle.borderLeft;
          targetElement.style.paddingLeft = computedStyle.paddingLeft;
          targetElement.style.fontStyle = computedStyle.fontStyle;
        }
      };
      
      // 递归复制所有元素的样式
      const applyStyles = (source: HTMLElement, target: HTMLElement) => {
        // 复制当前元素的样式
        copyComputedStyles(source, target);
        
        // 递归处理子元素
        const sourceChildren = source.children;
        const targetChildren = target.children;
        for (let i = 0; i < sourceChildren.length; i++) {
          if (sourceChildren[i] instanceof HTMLElement && targetChildren[i] instanceof HTMLElement) {
            applyStyles(sourceChildren[i] as HTMLElement, targetChildren[i] as HTMLElement);
          }
        }
      };
      
      // 应用所有样式
      applyStyles(posterElement, clonedPoster);
      
      // 添加元素到临时容器
      tempContainer.appendChild(clonedPoster);
      document.body.appendChild(tempContainer);
      
      // 确保所有字体已加载
      await document.fonts.ready;
      
      // 延迟一小段时间确保DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        // 使用dom-to-image处理，直接捕获整个tempContainer，保留背景和布局
        const dataUrl = await domtoimage.toPng(clonedPoster, {
          quality: 1,
          bgcolor: '#ffffff',
          height: clonedPoster.offsetHeight,
          width: clonedPoster.offsetWidth,
          style: {
            'margin': '0',
            'padding': clonedPoster.style.padding,
          },
          filter: (node: Node) => {
            // 保留文本节点
            if (node.nodeType === 3) { // 文本节点
              return true;
            }
            
            // 对于元素节点
            if (node instanceof Element) {
              // 排除按钮等交互元素
              if (node.tagName === 'BUTTON' || 
                  node.tagName === 'INPUT' || 
                  node.tagName === 'SELECT') {
                return false;
              }
              
              // 检查是否有隐藏元素
              const style = window.getComputedStyle(node);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
              }
            }
            
            // 默认保留节点
            return true;
          },
          cacheBust: true, // 避免缓存问题
        });
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `markdown-poster-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // 触发下载
        link.click();
        
        // 清理
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(dataUrl);
        }, 100);
        
        // 显示成功通知
        showNotificationMessage('海报已成功下载！', 3000);
      } finally {
        // 确保移除临时容器
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    } catch (error) {
      console.error('下载海报时出错:', error);
      showNotificationMessage(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`, 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* 头部导航 */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Markdown海报制作</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1 bg-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-500 transition-colors">
            自定义
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center space-x-1 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDownloadPoster}
            disabled={isDownloading}
            aria-label="下载海报"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && !isDownloading && handleDownloadPoster(e as unknown as React.MouseEvent<HTMLButtonElement>)}
          >
            {isDownloading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">处理中...</span>
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">下载海报</span>
                <span className="sm:hidden">下载</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex flex-col lg:flex-row h-[calc(100vh-132px)]">
        {/* 左侧编辑区 */}
        <div className="w-full lg:w-1/2 border-r border-gray-200 dark:border-gray-700 h-full overflow-hidden">
          <div className="h-full overflow-auto p-4">
            <MarkdownEditor
              value={markdown}
              onChange={setMarkdown}
              className="h-full"
            />
          </div>
        </div>

        {/* 右侧预览区 */}
        <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-b from-purple-600 to-blue-500 h-full overflow-hidden" ref={previewRef}>
          <div className="flex-1 flex justify-center items-start p-8 overflow-auto">
            <div 
              ref={posterRef}
              className="bg-white rounded-xl shadow-xl"
              style={{
                width: `${posterWidth / 2}px`,
                maxWidth: '100%',
              }}
            >
              <MarkdownPreview 
                content={markdown}
                className="w-full p-8"
                designer={designer}
              />
            </div>
          </div>
          <div className="p-4 bg-purple-900/30 text-white text-xs text-center">
            <span className="bg-purple-900 px-4 py-1 rounded-full text-xs">Powered by ReadPo</span>
          </div>
        </div>
      </main>

      {/* 底部版权信息 */}
      <footer className="bg-white dark:bg-gray-800 py-4 px-6 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
        <p>© {currentYear} Markdown Poster. 保留所有权利。使用本服务即表示您同意我们的<a href="#" className="text-blue-500 hover:underline">服务条款</a>和<a href="#" className="text-blue-500 hover:underline">隐私政策</a>。</p>
      </footer>

      {/* 通知提示 */}
      {showNotification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
}
