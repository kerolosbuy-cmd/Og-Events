'use client';

import React from 'react';
import NextImage from 'next/image';
import { Move } from 'lucide-react';
import { TicketSize, TicketElements, TicketElementKey } from './types';

interface TicketCanvasProps {
  ticketSize: TicketSize;
  ticketElements: TicketElements;
  activeElement: TicketElementKey | string | null;
  imagePreview: string | null;
  selectedImage: string | null;
  imageUploading: boolean;
  isDragging: boolean;
  onElementMouseDown: (e: React.MouseEvent, elementName: TicketElementKey | string) => void;
  onResizeMouseDown: (
    e: React.MouseEvent,
    elementName: TicketElementKey | string,
    handle: string
  ) => void;
}

export default function TicketCanvas({
  ticketSize,
  ticketElements,
  activeElement,
  imagePreview,
  selectedImage,
  imageUploading,
  isDragging,
  onElementMouseDown,
  onResizeMouseDown,
}: TicketCanvasProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 flex p-8 overflow-auto">
        <div className="rounded-lg p-6 flex flex-col">
          <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
            <Move className="h-4 w-4" />
            <span>
              Click and drag elements to move them. Use the resize handle to resize elements.
            </span>
          </div>

          <div
            className="relative mx-auto border-2 border-gray-300 rounded-lg overflow-hidden shadow-md bg-white"
            style={{ width: `${ticketSize.width}px`, height: `${ticketSize.height}px` }}
          >
            {/* Background Image */}
            {ticketElements.backgroundImage.visible && (imagePreview || selectedImage) && (
              <div
                className={`absolute border ${activeElement === 'backgroundImage' ? 'border-blue-500' : 'border-transparent'}`}
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
                  src={selectedImage || imagePreview || ''}
                  alt="Ticket background"
                  fill
                  className="object-cover"
                  draggable={false}
                  unoptimized
                  onError={e => {
                    console.error('Image failed to load:', e.currentTarget.src);
                  }}
                />
                {imageUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="text-white">Uploading image...</div>
                  </div>
                )}

                {/* Resize Handles for Background */}
                {activeElement === 'backgroundImage' && (
                  <ResizeHandles
                    onResizeMouseDown={e =>
                      onResizeMouseDown(
                        e,
                        'backgroundImage',
                        e.currentTarget.dataset.handle as string
                      )
                    }
                  />
                )}
              </div>
            )}

            {/* QR Code */}
            {ticketElements.qrCode.visible && (
              <div
                className={`absolute border ${activeElement === 'qrCode' ? 'border-blue-500' : 'border-transparent'}`}
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
                {/* Placeholder for QR Code - using a generic image or div */}
                <div className="w-full h-full flex items-center justify-center border border-gray-200 bg-white">
                  <span className="text-xs text-gray-400">QR Code</span>
                </div>

                {/* Resize Handles for QR Code */}
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
                className={`absolute border ${activeElement === textElement.id ? 'border-blue-500' : 'border-transparent'} truncate`}
                style={{
                  left: `${textElement.position.x}px`,
                  top: `${textElement.position.y}px`,
                  width: `${textElement.position.width}px`,
                  height: `${textElement.position.height}px`,
                  fontFamily: textElement.position.fontFamily,
                  fontSize: `${textElement.position.fontSize}px`,
                  color: textElement.position.fontColor,
                  backgroundColor: `rgbaHex(${textElement.position.backgroundColor}, ${textElement.position.backgroundOpacity})`, // Simplification - need helper or style approach
                  fontWeight: textElement.position.fontWeight,
                  fontStyle: textElement.position.fontStyle,
                  textDecoration: textElement.position.textDecoration,
                  textTransform: textElement.position.textTransform as any,
                  textAlign: textElement.position.textAlign as any,
                  cursor: isDragging && activeElement === textElement.id ? 'grabbing' : 'grab',
                  zIndex: 20,
                  whiteSpace: 'pre-wrap', // Allow wrapping
                }}
                onMouseDown={e => onElementMouseDown(e, textElement.id)}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: textElement.position.backgroundColor, // Applied here for opacity support if needed more complexly
                    opacity: textElement.position.backgroundOpacity,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                  }}
                ></div>
                {textElement.content}

                {/* Resize Handles for Text */}
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
        </div>
      </div>
    </div>
  );
}

// Helper component for resize handles to avoid repetition
function ResizeHandles({
  onResizeMouseDown,
}: {
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const handles = [
    {
      cursor: 'nwse-resize',
      pos: 'top-0 left-0',
      translate: '-translate-x-1/2 -translate-y-1/2',
      handle: 'nw',
    },
    {
      cursor: 'nesw-resize',
      pos: 'top-0 right-0',
      translate: 'translate-x-1/2 -translate-y-1/2',
      handle: 'ne',
    },
    {
      cursor: 'nwse-resize',
      pos: 'bottom-0 right-0',
      translate: 'translate-x-1/2 translate-y-1/2',
      handle: 'se',
    },
    {
      cursor: 'nesw-resize',
      pos: 'bottom-0 left-0',
      translate: '-translate-x-1/2 translate-y-1/2',
      handle: 'sw',
    },
    {
      cursor: 'ns-resize',
      pos: 'top-0 left-1/2',
      translate: '-translate-x-1/2 -translate-y-1/2',
      handle: 'n',
    },
    {
      cursor: 'ns-resize',
      pos: 'bottom-0 left-1/2',
      translate: '-translate-x-1/2 translate-y-1/2',
      handle: 's',
    },
    {
      cursor: 'ew-resize',
      pos: 'top-1/2 right-0',
      translate: 'translate-x-1/2 -translate-y-1/2',
      handle: 'e',
    }, // Simplified
    {
      cursor: 'ew-resize',
      pos: 'top-1/2 left-0',
      translate: '-translate-x-1/2 -translate-y-1/2',
      handle: 'w',
    }, // Simplified
  ];

  return (
    <>
      {handles.map((h, i) => (
        <div
          key={i}
          data-handle={h.handle}
          className={`absolute ${h.pos} w-3 h-3 bg-blue-500 ${h.cursor} transform ${h.translate}`}
          onMouseDown={onResizeMouseDown}
        />
      ))}
    </>
  );
}
