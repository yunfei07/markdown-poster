declare module 'dom-to-image-more' {
  export function toPng(
    node: HTMLElement, 
    options?: {
      quality?: number;
      bgcolor?: string;
      width?: number;
      height?: number;
      style?: Record<string, string>;
      filter?: (node: Node) => boolean;
      canvasWidth?: number;
      canvasHeight?: number;
      cacheBust?: boolean;
      skipFonts?: boolean;
      scale?: number;
      imagePlaceholder?: string;
    }
  ): Promise<string>;
  
  export function toJpeg(
    node: HTMLElement, 
    options?: {
      quality?: number;
      bgcolor?: string;
      width?: number;
      height?: number;
      style?: Record<string, string>;
      filter?: (node: Node) => boolean;
      canvasWidth?: number;
      canvasHeight?: number;
      cacheBust?: boolean;
      skipFonts?: boolean;
      scale?: number;
      imagePlaceholder?: string;
    }
  ): Promise<string>;
  
  export function toBlob(
    node: HTMLElement, 
    options?: {
      quality?: number;
      bgcolor?: string;
      width?: number;
      height?: number;
      style?: Record<string, string>;
      filter?: (node: Node) => boolean;
      canvasWidth?: number;
      canvasHeight?: number;
      cacheBust?: boolean;
      skipFonts?: boolean;
      scale?: number;
      imagePlaceholder?: string;
    }
  ): Promise<Blob>;
  
  export function toSvg(
    node: HTMLElement, 
    options?: {
      quality?: number;
      bgcolor?: string;
      width?: number;
      height?: number;
      style?: Record<string, string>;
      filter?: (node: Node) => boolean;
      canvasWidth?: number;
      canvasHeight?: number;
      cacheBust?: boolean;
      skipFonts?: boolean;
      scale?: number;
      imagePlaceholder?: string;
    }
  ): Promise<string>;
  
  export default {
    toPng,
    toJpeg,
    toBlob,
    toSvg
  };
} 