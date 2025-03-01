import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Designer {
  name: string;
  title: string;
}

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  designer?: Designer;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className = '',
  designer,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 监控图片加载状态
  useEffect(() => {
    if (previewRef.current) {
      const images = previewRef.current.querySelectorAll('img');
      
      if (images.length === 0) {
        setImagesLoaded(true);
        return;
      }
      
      // 重置图片加载状态
      setImagesLoaded(false);
      
      let loadedCount = 0;
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            const onLoad = () => {
              loadedCount++;
              if (loadedCount === images.length) {
                setImagesLoaded(true);
              }
              img.removeEventListener('load', onLoad);
              img.removeEventListener('error', onError);
              imageObserver.unobserve(img);
            };
            
            const onError = () => {
              console.warn(`图片加载失败: ${img.src}`);
              loadedCount++;
              if (loadedCount === images.length) {
                setImagesLoaded(true);
              }
              img.removeEventListener('load', onLoad);
              img.removeEventListener('error', onError);
              imageObserver.unobserve(img);
            };
            
            // 检查图片是否已经加载完成
            if (img.complete && img.naturalWidth !== 0) {
              onLoad();
            } else {
              img.addEventListener('load', onLoad);
              img.addEventListener('error', onError);
            }
          }
        });
      });
      
      // 观察所有图片
      images.forEach(img => imageObserver.observe(img));
      
      return () => {
        // 清理观察器
        imageObserver.disconnect();
      };
    }
  }, [content]);

  return (
    <div 
      ref={previewRef}
      className={`flex flex-col justify-between rounded-md bg-white ${className} ${imagesLoaded ? 'images-loaded' : 'images-loading'}`}
      id="markdown-preview"
      data-images-loaded={imagesLoaded}
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}
    >
      {/* Markdown 内容区域 */}
      <div className="markdown-content prose prose-stone dark:prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({src, alt}) => (
              <span className="block my-4" style={{ display: 'block', position: 'relative' }}>
                <img
                  src={src}
                  alt={alt || '图片'}
                  className="rounded-lg w-full object-cover shadow-md"
                  loading="eager"
                  crossOrigin="anonymous"
                  data-export-include="true"
                  style={{
                    borderRadius: '0.5rem',
                    width: '100%',
                    display: 'block',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </span>
            ),
            h1: ({children}) => (
              <h1 
                className="text-3xl font-bold mb-4"
                style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#111827'
                }}
              >
                {children}
              </h1>
            ),
            h2: ({children}) => (
              <h2 
                className="text-xl font-semibold mt-6 mb-2"
                style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  marginTop: '1.5rem',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}
              >
                {children}
              </h2>
            ),
            p: ({children}) => {
              // 检查是否包含引号，如果有则应用不同样式
              const childrenStr = String(children);
              if (childrenStr.startsWith('"') && childrenStr.endsWith('"')) {
                return (
                  <div 
                    className="border-l-4 border-gray-300 pl-4 py-1 italic text-gray-700 my-4"
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftStyle: 'solid',
                      borderLeftColor: '#d1d5db',
                      paddingLeft: '1rem',
                      paddingTop: '0.25rem',
                      paddingBottom: '0.25rem',
                      fontStyle: 'italic',
                      color: '#4b5563',
                      margin: '1rem 0'
                    }}
                  >
                    {children}
                  </div>
                );
              }
              return (
                <p 
                  className="my-2"
                  style={{ 
                    margin: '0.5rem 0',
                    color: '#374151',
                    lineHeight: '1.625'
                  }}
                >
                  {children}
                </p>
              );
            },
            ul: ({children}) => (
              <ul 
                className="list-disc pl-6 my-4 space-y-2"
                style={{ 
                  listStyleType: 'disc',
                  paddingLeft: '1.5rem',
                  margin: '1rem 0',
                  display: 'block'
                }}
              >
                {children}
              </ul>
            ),
            ol: ({children}) => (
              <ol 
                className="list-decimal pl-6 my-4 space-y-2"
                style={{ 
                  listStyleType: 'decimal',
                  paddingLeft: '1.5rem',
                  margin: '1rem 0',
                  display: 'block'
                }}
              >
                {children}
              </ol>
            ),
            li: ({children, ...props}) => (
              <li 
                className="my-1 pl-1" 
                style={{ 
                  margin: '0.25rem 0',
                  paddingLeft: '0.25rem',
                  display: 'list-item'
                }}
                {...props}
              >
                {children}
              </li>
            ),
            code: ({children}) => (
              <code 
                className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-sm"
                style={{ 
                  backgroundColor: '#f3f4f6',
                  padding: '0.125rem 0.25rem',
                  borderRadius: '0.25rem',
                  color: '#1f2937',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '0.875rem'
                }}
              >
                {children}
              </code>
            ),
            strong: ({children}) => (
              <strong 
                className="font-semibold text-gray-900"
                style={{ 
                  fontWeight: '600',
                  color: '#111827'
                }}
              >
                {children}
              </strong>
            ),
            em: ({children}) => (
              <em 
                className="italic text-gray-800"
                style={{ 
                  fontStyle: 'italic',
                  color: '#1f2937'
                }}
              >
                {children}
              </em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      {/* 设计者信息 */}
      {designer && (
        <div 
          className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500"
          style={{ 
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}
        >
          <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 text-purple-700 font-medium"
              style={{ 
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                backgroundColor: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.5rem',
                color: '#7e22ce',
                fontWeight: '500'
              }}
            >
              {designer.name.charAt(0)}
            </div>
            <div>
              <div 
                className="font-medium text-gray-700"
                style={{ 
                  fontWeight: '500',
                  color: '#374151'
                }}
              >
                {designer.name}
              </div>
              <div 
                className="text-xs text-gray-500"
                style={{ 
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}
              >
                {designer.title}
              </div>
            </div>
          </div>
          <div 
            className="text-xs opacity-70 bg-gray-100 px-2 py-1 rounded"
            style={{ 
              fontSize: '0.75rem',
              opacity: '0.7',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            {new Date().toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownPreview; 