'use client';

import React from 'react';
import NextImage from 'next/image';
import { Move, QrCode } from 'lucide-react';
import { TicketSize, TicketElements, TicketElementKey, TicketDetails } from './types';

interface TicketCanvasProps {
  ticketSize: TicketSize;
  ticketElements: TicketElements;
  ticketDetails: TicketDetails;
  activeElement: TicketElementKey | string | null;
  imagePreview: string | null;
  selectedImage: string | null;
  imageUploading: boolean;
  isDragging?: boolean;
  onElementMouseDown: (e: React.MouseEvent, elementName: TicketElementKey | string) => void;
  onResizeMouseDown: (
    e: React.MouseEvent,
    elementName: TicketElementKey | string,
    handle: string
  ) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function TicketCanvas({
  ticketSize,
  ticketElements,
  ticketDetails,
  activeElement,
  imagePreview,
  selectedImage,
  imageUploading,
  isDragging = false,
  onElementMouseDown,
  onResizeMouseDown,
  canvasRef,
}: TicketCanvasProps) {
  return (
    <div>
      <div
        className="relative shadow-2xl transition-all duration-500 ease-out"
        style={{
          width: `${ticketSize.width}px`,
          height: `${ticketSize.height}px`,
          backgroundColor: '#ffffff'
        }}
      >
        {/* Transparent grid background for canvas */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

        {/* Background Image */}
        {ticketElements.backgroundImage.visible && (imagePreview || selectedImage || ticketElements.backgroundImage.url) && (
          <div
            className={`absolute transition-shadow duration-200 ${activeElement === 'backgroundImage' ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 group' : ''}`}
            style={{
              left: `${ticketElements.backgroundImage.x}px`,
              top: `${ticketElements.backgroundImage.y}px`,
              width: `${ticketElements.backgroundImage.width}px`,
              height: `${ticketElements.backgroundImage.height}px`,
              cursor: isDragging && activeElement === 'backgroundImage' ? 'grabbing' : 'grab',
              zIndex: 0,
            }}
            onMouseDown={e => onElementMouseDown(e, 'backgroundImage')}
          >
            <NextImage
              src={selectedImage || imagePreview || ticketElements.backgroundImage.url || ''}
              alt="Ticket background"
              fill
              className="object-cover"
              draggable={false}
              unoptimized
            />
            {imageUploading && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Uploading</span>
                </div>
              </div>
            )}

            {activeElement === 'backgroundImage' && (
              <ResizeHandles
                onResizeMouseDown={e =>
                  onResizeMouseDown(e, 'backgroundImage', e.currentTarget.dataset.handle as string)
                }
              />
            )}
          </div>
        )}

        {/* QR Code */}
        {ticketElements.qrCode.visible && (
          <div
            className={`absolute transition-all duration-200 ${activeElement === 'qrCode'
              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white shadow-xl scale-[1.02]'
              : 'hover:ring-1 hover:ring-indigo-300 ring-offset-0'
              }`}
            style={{
              left: `${ticketElements.qrCode.x}px`,
              top: `${ticketElements.qrCode.y}px`,
              width: `${ticketElements.qrCode.width}px`,
              height: `${ticketElements.qrCode.height}px`,
              backgroundColor: ticketElements.qrCode.transparentBackground
                ? 'transparent'
                : ticketElements.qrCode.backgroundColor,
              cursor: isDragging && activeElement === 'qrCode' ? 'grabbing' : 'grab',
              zIndex: 10,
            }}
            onMouseDown={e => onElementMouseDown(e, 'qrCode')}
          >
            <div className="w-full h-full flex flex-col items-center justify-center border border-slate-200/50 bg-slate-50/10 backdrop-blur-sm overflow-hidden rounded-sm">
              <QrCode className="h-1/2 w-1/2 text-slate-400 opacity-20" />
              <span className="text-[8px] font-bold text-slate-400/50 uppercase tracking-tighter mt-1">QR AREA</span>
            </div>

            {activeElement === 'qrCode' && (
              <ResizeHandles
                onResizeMouseDown={e =>
                  onResizeMouseDown(e, 'qrCode', e.currentTarget.dataset.handle as string)
                }
              />
            )}
          </div>
        )}

        {/* Custom Text Elements */}
        {ticketElements.customTexts.map(textElement => (
          <div
            key={textElement.id}
            className={`absolute transition-all duration-200 group ${activeElement === textElement.id
              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white shadow-xl z-30'
              : 'hover:ring-1 hover:ring-indigo-300 z-20'
              }`}
            style={{
              left: `${textElement.position.x}px`,
              top: `${textElement.position.y}px`,
              width: `${textElement.position.width}px`,
              height: `${textElement.position.height}px`,
              fontFamily: textElement.position.fontFamily,
              fontSize: `${textElement.position.fontSize}px`,
              color: textElement.position.fontColor,
              backgroundColor: hexToRgba(textElement.position.backgroundColor, textElement.position.backgroundOpacity),
              fontWeight: textElement.position.fontWeight,
              fontStyle: textElement.position.fontStyle,
              textDecoration: textElement.position.textDecoration,
              textTransform: textElement.position.textTransform as any,
              textAlign: textElement.position.textAlign as any,
              cursor: isDragging && activeElement === textElement.id ? 'grabbing' : 'grab',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: textElement.position.textAlign === 'center' ? 'center' : textElement.position.textAlign === 'right' ? 'flex-end' : 'flex-start',
              whiteSpace: 'pre-wrap',
            }}
            onMouseDown={e => onElementMouseDown(e, textElement.id)}
          >
            {textElement.content}

            {activeElement === textElement.id && (
              <ResizeHandles
                onResizeMouseDown={e =>
                  onResizeMouseDown(e, textElement.id, e.currentTarget.dataset.handle as string)
                }
              />
            )}
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

function ResizeHandles({
  onResizeMouseDown,
}: {
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const handles = [
    { cursor: 'nwse-resize', pos: '-top-1.5 -left-1.5', handle: 'nw' },
    { cursor: 'nesw-resize', pos: '-top-1.5 -right-1.5', handle: 'ne' },
    { cursor: 'nwse-resize', pos: '-bottom-1.5 -right-1.5', handle: 'se' },
    { cursor: 'nesw-resize', pos: '-bottom-1.5 -left-1.5', handle: 'sw' },
    { cursor: 'ns-resize', pos: '-top-1.5 left-1/2 -translate-x-1/2', handle: 'n' },
    { cursor: 'ns-resize', pos: '-bottom-1.5 left-1/2 -translate-x-1/2', handle: 's' },
    { cursor: 'ew-resize', pos: 'top-1/2 -right-1.5 -translate-y-1/2', handle: 'e' },
    { cursor: 'ew-resize', pos: 'top-1/2 -left-1.5 -translate-y-1/2', handle: 'w' },
  ];

  return (
    <>
      <div className="absolute inset-0 pointer-events-none ring-1 ring-indigo-500/50 scale-[1.01]"></div>
      {handles.map((h, i) => (
        <div
          key={i}
          data-handle={h.handle}
          className={`absolute ${h.pos} w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-md hover:scale-125 transition-transform z-50 ${h.cursor}`}
          onMouseDown={onResizeMouseDown}
        />
      ))}
    </>
  );
}

function hexToRgba(hex: string, opacity: number) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
