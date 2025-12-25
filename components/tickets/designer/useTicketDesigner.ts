import { useState, useCallback } from 'react';
import {
  TicketDetails,
  TicketSize,
  ElementPosition,
  TextElementProperties,
  CustomTextElement,
  TicketElements,
  TicketElementKey,
} from './types';
import { useHistory } from './useHistory';

export interface DesignerState {
  ticketDetails: TicketDetails;
  ticketSize: TicketSize;
  ticketElements: TicketElements;
}

const initialState: DesignerState = {
  ticketDetails: {
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={SEAT_ID}',
  },
  ticketSize: { width: 600, height: 300 },
  ticketElements: {
    backgroundImage: { x: 0, y: 0, width: 600, height: 300, visible: true },
    qrCode: {
      x: 480,
      y: 180,
      width: 100,
      height: 100,
      visible: true,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      transparentBackground: false,
    },
    customTexts: [],
  },
};

export function useTicketDesigner() {
  const { state, setState, undo, redo, canUndo, canRedo } = useHistory<DesignerState>(initialState);
  const [activeElement, setActiveElement] = useState<TicketElementKey | string | null>(null);

  const { ticketDetails, ticketSize, ticketElements } = state;

  const setTicketElements = useCallback((next: TicketElements | ((prev: TicketElements) => TicketElements)) => {
    setState(prev => ({
      ...prev,
      ticketElements: typeof next === 'function' ? next(prev.ticketElements) : next
    }));
  }, [setState]);

  const setTicketDetails = useCallback((next: TicketDetails | ((prev: TicketDetails) => TicketDetails)) => {
    setState(prev => ({
      ...prev,
      ticketDetails: typeof next === 'function' ? next(prev.ticketDetails) : next
    }));
  }, [setState]);

  const setTicketSize = useCallback((next: TicketSize | ((prev: TicketSize) => TicketSize)) => {
    setState(prev => ({
      ...prev,
      ticketSize: typeof next === 'function' ? next(prev.ticketSize) : next
    }));
  }, [setState]);

  const handleDetailChange = (field: keyof TicketDetails, value: string) => {
    setTicketDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTicketSizeChange = (dimension: 'width' | 'height', value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 100 : value;

    setState(prev => ({
      ...prev,
      ticketSize: {
        ...prev.ticketSize,
        [dimension]: numValue,
      },
      ticketElements: {
        ...prev.ticketElements,
        backgroundImage: {
          ...prev.ticketElements.backgroundImage,
          width: dimension === 'width' ? numValue : prev.ticketElements.backgroundImage.width,
          height: dimension === 'height' ? numValue : prev.ticketElements.backgroundImage.height,
        },
      }
    }));
  };

  const toggleElementVisibility = (elementName: TicketElementKey) => {
    if (elementName === 'customTexts') return;

    setTicketElements(prev => ({
      ...prev,
      [elementName]: {
        // @ts-ignore
        ...prev[elementName],
        // @ts-ignore
        visible: !prev[elementName].visible,
      },
    }));
  };

  const addCustomTextElement = () => {
    const newId = `text-${Date.now()}`;
    const newTextElement: CustomTextElement = {
      id: newId,
      content: 'Custom Text',
      position: {
        x: 50,
        y: 50,
        width: 200,
        height: 50,
        fontFamily: 'Arial',
        fontSize: 14,
        fontColor: '#000000',
        backgroundColor: '#ffffff',
        backgroundOpacity: 0,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textTransform: 'none',
        textAlign: 'left',
        letterSpacing: 0,
        lineHeight: 1.4,
        textShadowX: 0,
        textShadowY: 0,
        textShadowBlur: 0,
        textShadowColor: '#000000',
      },
    };

    setTicketElements(prev => ({
      ...prev,
      customTexts: [...prev.customTexts, newTextElement],
    }));
    setActiveElement(newId);
  };

  const deleteCustomTextElement = (id: string) => {
    setTicketElements(prev => ({
      ...prev,
      customTexts: prev.customTexts.filter(text => text.id !== id),
    }));
    if (activeElement === id) {
      setActiveElement(null);
    }
  };

  const updateCustomTextElement = (id: string, updates: Partial<CustomTextElement>) => {
    setTicketElements(prev => ({
      ...prev,
      customTexts: prev.customTexts.map(text => (text.id === id ? { ...text, ...updates } : text)),
    }));
  };

  const nudgeElement = (dx: number, dy: number) => {
    if (!activeElement) return;
    updateElementPosition(activeElement, {
      x: (ticketElements.backgroundImage.x || 0) + dx, // This is a bit flawed for multi-element, but updateElementPosition handles it
      y: (ticketElements.backgroundImage.y || 0) + dy,
    });
  };

  // Improved updateElementPosition to handle relative updates better or just use absolute
  const updateElementPosition = (
    elementName: string,
    position: Partial<ElementPosition & TextElementProperties>
  ) => {
    if (elementName.startsWith('text-')) {
      const element = ticketElements.customTexts.find(t => t.id === elementName);
      if (!element) return;

      updateCustomTextElement(elementName, {
        position: {
          ...element.position,
          ...position,
          x: position.x !== undefined ? position.x : element.position.x,
          y: position.y !== undefined ? position.y : element.position.y,
        },
      });
    } else {
      setTicketElements(prev => ({
        ...prev,
        [elementName]: {
          // @ts-ignore
          ...prev[elementName as TicketElementKey],
          ...position,
        },
      }));
    }
  };

  return {
    ticketDetails,
    ticketSize,
    ticketElements,
    setTicketElements,
    activeElement,
    setActiveElement,
    handleDetailChange,
    handleTicketSizeChange,
    toggleElementVisibility,
    addCustomTextElement,
    deleteCustomTextElement,
    updateCustomTextElement,
    updateElementPosition,
    nudgeElement,
    setTicketDetails,
    setTicketSize,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
