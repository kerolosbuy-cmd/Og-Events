import { useEffect, useCallback } from 'react';
import { TicketElements, TicketDetails, TicketSize } from './types';

interface UseTicketRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ticketElements: TicketElements;
  ticketDetails: TicketDetails;
  ticketSize: TicketSize;
  selectedImage: string | null;
  imagePreview: string | null;
}

export function useTicketRenderer({
  canvasRef,
  ticketElements,
  ticketDetails,
  ticketSize,
  selectedImage,
  imagePreview,
}: UseTicketRendererProps) {
  const generateTicket = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on ticket size
    canvas.width = ticketSize.width;
    canvas.height = ticketSize.height;

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    const drawContent = () => {
      // Draw QR code (if available and visible)
      if (ticketDetails.qrCode && ticketElements.qrCode.visible) {
        const qrImg = new window.Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          ctx.drawImage(
            qrImg,
            ticketElements.qrCode.x,
            ticketElements.qrCode.y,
            ticketElements.qrCode.width,
            ticketElements.qrCode.height
          );
        };
        qrImg.src = ticketDetails.qrCode;
      }

      // Draw custom text elements
      ticketElements.customTexts.forEach(textElement => {
        // Draw background if needed
        if (textElement.position.backgroundOpacity > 0) {
          ctx.fillStyle = textElement.position.backgroundColor;
          ctx.globalAlpha = textElement.position.backgroundOpacity;
          ctx.fillRect(
            textElement.position.x,
            textElement.position.y,
            textElement.position.width,
            textElement.position.height
          );
        }

        // Reset alpha and set text color
        ctx.globalAlpha = 1;
        ctx.fillStyle = textElement.position.fontColor;

        // Draw text with all font properties
        const fontWeight = textElement.position.fontWeight || 'normal';
        const fontStyle = textElement.position.fontStyle || 'normal';
        ctx.font = `${fontStyle} ${fontWeight} ${textElement.position.fontSize}px ${textElement.position.fontFamily}`;

        // Apply text shadow if specified
        if (
          textElement.position.textShadowX !== undefined &&
          textElement.position.textShadowY !== undefined &&
          textElement.position.textShadowBlur !== undefined &&
          textElement.position.textShadowColor
        ) {
          ctx.shadowColor = textElement.position.textShadowColor;
          ctx.shadowOffsetX = textElement.position.textShadowX;
          ctx.shadowOffsetY = textElement.position.textShadowY;
          ctx.shadowBlur = textElement.position.textShadowBlur;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 0;
        }

        // Handle text wrapping if needed
        const words = textElement.content.split(' ');
        let line = '';
        let y = textElement.position.y + parseInt(textElement.position.fontSize.toString()) + 5;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > textElement.position.width - 10 && n > 0) {
            ctx.fillText(line, textElement.position.x + 5, y);
            line = words[n] + ' ';
            y += parseInt(textElement.position.fontSize.toString()) + 5;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, textElement.position.x + 5, y);
      });
    };

    // Draw background image (if available and visible)
    if ((imagePreview || selectedImage || ticketElements.backgroundImage.url) && ticketElements.backgroundImage.visible) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(
          img,
          ticketElements.backgroundImage.x,
          ticketElements.backgroundImage.y,
          ticketElements.backgroundImage.width,
          ticketElements.backgroundImage.height
        );
        drawContent();
      };
      img.src = selectedImage || imagePreview || ticketElements.backgroundImage.url || '';
    } else {
      drawContent();
    }
  }, [canvasRef, ticketElements, ticketDetails, ticketSize, selectedImage, imagePreview]);

  // Re-render when dependencies change
  useEffect(() => {
    generateTicket();
  }, [generateTicket]);

  return { generateTicket };
}
