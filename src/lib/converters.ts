import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export type ConversionFunction = (file: File) => Promise<void>;

async function convertImageToPDF(file: File) {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const widthRatio = pdfWidth / img.width;
      const heightRatio = pdfHeight / img.height;
      const ratio = Math.min(widthRatio, heightRatio);
      
      const centerX = (pdfWidth - img.width * ratio) / 2;
      const centerY = (pdfHeight - img.height * ratio) / 2;
      
      pdf.addImage(
        img,
        'JPEG',
        centerX,
        centerY,
        img.width * ratio,
        img.height * ratio
      );
      
      pdf.save(`converted-${file.name}.pdf`);
      URL.revokeObjectURL(imageUrl);
      resolve();
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

async function convertSVGToPNG(file: File) {
  const svgText = await file.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svg = svgDoc.documentElement;
  
  // Get SVG dimensions with viewBox support
  let width = parseInt(svg.getAttribute('width') || '0');
  let height = parseInt(svg.getAttribute('height') || '0');
  
  // If width/height are not set, try to get them from viewBox
  if (!width || !height) {
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const [, , w, h] = viewBox.split(' ').map(Number);
      width = w;
      height = h;
    }
  }
  
  // Fallback dimensions if neither width/height nor viewBox are set
  if (!width || !height) {
    width = 800;
    height = 600;
  }
  
  // Set explicit dimensions on SVG
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  
  // Create a blob URL for the modified SVG
  const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas with device pixel ratio for better quality
      const scale = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Scale the context for high DPI displays
      ctx.scale(scale, scale);
      
      // Clear the canvas (transparent background)
      ctx.clearRect(0, 0, width, height);
      
      // Draw SVG
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to PNG with transparency
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fileName = file.name.replace(/\.svg$/, '.png');
            saveAs(blob, `converted-${fileName}`);
            resolve();
          } else {
            reject(new Error('Failed to convert SVG to PNG'));
          }
        },
        'image/png'
      );
      
      URL.revokeObjectURL(svgUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error('Failed to load SVG'));
    };
    
    img.src = svgUrl;
  });
}

async function convertToWebP(file: File) {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            saveAs(blob, `converted-${file.name}.webp`);
            resolve();
          } else {
            reject(new Error('Failed to convert to WebP'));
          }
        },
        'image/webp',
        0.8
      );
      
      URL.revokeObjectURL(imageUrl);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

export const converters: Record<string, ConversionFunction> = {
  'to-pdf': convertImageToPDF,
  'to-png': convertSVGToPNG,
  'to-webp': convertToWebP,
};