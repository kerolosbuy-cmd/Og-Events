'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import TicketToolbar from './designer/TicketToolbar';
import TicketPropertiesPanel from './designer/TicketPropertiesPanel';
import TicketCanvas from './designer/TicketCanvas';
import { TicketSaveDialog, TicketLoadDialog } from './designer/TicketDialogs';
import { useTicketDesigner } from './designer/useTicketDesigner';
import { useCanvasInteraction } from './designer/useCanvasInteraction';
import { useTicketRenderer } from './designer/useTicketRenderer';
import { TicketElementKey, TicketSize, CustomTextElement } from './designer/types';
import { getVenueData, saveTicketTemplate } from '@/app/og-admin/actions/designer-actions';
import { toast } from 'sonner';
import { useKeyboardShortcuts } from './designer/useKeyboardShortcuts';

export default function TicketDesigner() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const jsonInputRef = useRef<HTMLInputElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!); // For export

  // 1. Core State Management Hook
  const {
    ticketDetails,
    setTicketDetails,
    ticketSize,
    handleTicketSizeChange,
    ticketElements,
    setTicketElements,
    activeElement,
    setActiveElement,
    handleDetailChange,
    addCustomTextElement,
    updateCustomTextElement,
    deleteCustomTextElement,
    toggleElementVisibility,
    updateElementPosition,
    nudgeElement,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTicketDesigner();

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    undo,
    redo,
    save: () => saveToDatabase(),
    deleteElement: () => {
      if (activeElement?.toString().startsWith('text-')) {
        deleteCustomTextElement(activeElement as string);
      }
    },
    nudge: nudgeElement,
    activeElement,
  });

  // 2. Interaction Hook (Drag & Resize)
  const {
    isDragging,
    handleElementMouseDown,
    handleResizeMouseDown,
    // We don't expose mousemove/up handlers directly as they are attached to window in the hook
  } = useCanvasInteraction({
    ticketElements,
    activeElement,
    setActiveElement,
    updateElementPosition,
    // Removed ticketSize as it was causing type error and not used
  });

  // 3. Additional Local State
  const [templateName, setTemplateName] = useState('New Ticket Template');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Dialog State
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // 4. Renderer Hook (for export)
  const { generateTicket } = useTicketRenderer({
    canvasRef,
    ticketElements,
    ticketDetails,
    ticketSize,
    selectedImage,
    imagePreview,
  });

  // Auto-load template when category changes
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.name === selectedCategory);
      if (category && category.templates && category.templates.length > 0) {
        loadFromDatabase(category.templates[0]);
      } else {
        // Optional: Reset to default if no template exists for this category
        // For now, let's just keep the current state or reset if you prefer.
        // User didn't ask for a reset, but auto-load is helpful.
      }
    }
  }, [selectedCategory, categories]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getVenueData();
        if (data && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) setSelectedCategory(data.categories[0].name);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch venue categories');
      }
    };
    fetchCategories();
  }, []);

  // Handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `ticket-backgrounds/${fileName}`;

      const { data, error } = await supabase.storage
        .from('ticket-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('ticket-assets')
        .getPublicUrl(filePath);

      setImagePreview(publicUrl);
      setSelectedImage(null);

      // Update the background image element with the new URL
      handleUpdateElement('backgroundImage', {
        visible: true,
        url: publicUrl,
      });

      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdateElement = (key: TicketElementKey, updates: Partial<any>) => {
    setTicketElements(prev => ({
      ...prev,
      [key]: {
        ...prev[key as 'backgroundImage' | 'qrCode'],
        ...updates
      }
    }));
  };

  const handleQrColorChange = (type: 'foreground' | 'background', color: string) => {
    handleUpdateElement('qrCode', type === 'foreground' ? { foregroundColor: color } : { backgroundColor: color });
  };

  const saveToDatabase = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }

    try {
      const template = {
        name: templateName,
        ticketElements,
        ticketSize,
        ticketDetails,
        backgroundImageUrl: imagePreview, // Use current preview URL as background
      };

      await saveTicketTemplate(selectedCategory, template);
      toast.success('Template saved successfully');
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error(`Save failed: ${error.message}`);
    }
  };

  const loadFromDatabase = (template: any) => {
    if (!template) return;

    if (template.name) setTemplateName(template.name);
    if (template.ticketElements) setTicketElements(template.ticketElements);
    if (template.ticketSize) {
      handleTicketSizeChange('width', template.ticketSize.width);
      handleTicketSizeChange('height', template.ticketSize.height);
    }
    if (template.ticketDetails) setTicketDetails(template.ticketDetails);

    const backgroundUrl = template.backgroundImageUrl || template.ticketElements?.backgroundImage?.url;
    if (backgroundUrl) {
      setImagePreview(backgroundUrl);
      setSelectedImage(null);
    } else {
      setImagePreview(null);
      setSelectedImage(null);
    }

    toast.info(`Loaded template: ${template.name}`);
    setShowLoadDialog(false);
  };

  const handleDirectLoad = () => {
    const category = categories.find(c => c.name === selectedCategory);
    if (category && category.templates && category.templates.length > 0) {
      loadFromDatabase(category.templates[0]);
    } else {
      toast.error('No template found for the selected category');
    }
  };

  const exportJSON = () => {
    const data = JSON.stringify({
      name: templateName,
      ticketElements,
      ticketSize,
      ticketDetails,
      backgroundImageUrl: imagePreview
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const exportImage = () => {
    generateTicket();
    setTimeout(() => {
      if (canvasRef.current) {
        const url = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateName.replace(/\s+/g, '_')}.png`;
        a.click();
      }
    }, 100);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadFromDatabase(json);
        toast.success('Template imported successfully');
      } catch (error) {
        console.error('Error importing JSON:', error);
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      {/* Premium Toolbar with Glassmorphism */}
      <div className="relative z-20">
        <TicketToolbar
          templateName={templateName}
          setTemplateName={setTemplateName}
          onSave={saveToDatabase}
          onLoad={handleDirectLoad}
          onBrowseCollection={() => setShowLoadDialog(true)}
          onImportJSON={() => jsonInputRef.current?.click()}
          onExport={exportJSON}
          onExportImage={exportImage}
          onAddText={addCustomTextElement}
          onImageUpload={handleImageUpload}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          fileInputRef={fileInputRef}
          canUndo={canUndo}
          canRedo={canRedo}
          undo={undo}
          redo={redo}
        />
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Canvas Area - Positioned at top-left */}
        <div className="flex-1 relative bg-slate-950 p-[20px] overflow-auto custom-scrollbar">
          <div className="relative group inline-block">
            <TicketCanvas
              ticketSize={ticketSize}
              ticketDetails={ticketDetails}
              ticketElements={ticketElements}
              activeElement={activeElement}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              imageUploading={imageUploading}
              onElementMouseDown={handleElementMouseDown}
              onResizeMouseDown={handleResizeMouseDown}
              isDragging={isDragging}
              canvasRef={canvasRef}
            />
          </div>
        </div>

        {/* Integrated Floating-style Sidebar with Blur */}
        <div className="w-[340px] border-l border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl z-10 flex flex-col h-full transform transition-all duration-300">
          <TicketPropertiesPanel
            activeElement={activeElement}
            onSelectElement={setActiveElement}
            ticketElements={ticketElements}
            ticketDetails={ticketDetails}
            ticketSize={ticketSize}
            onDetailChange={handleDetailChange}
            onSizeChange={(dim, val) => handleTicketSizeChange(dim, parseInt(val) || 0)}
            onToggleVisibility={(k) => toggleElementVisibility(k as TicketElementKey)}
            onUpdateCustomText={updateCustomTextElement}
            onDeleteCustomText={deleteCustomTextElement}
            onUpdateElement={handleUpdateElement}
            qrForegroundColor={ticketElements.qrCode.foregroundColor}
            setQrForegroundColor={(c) => handleQrColorChange('foreground', c)}
            qrBackgroundColor={ticketElements.qrCode.backgroundColor}
            setQrBackgroundColor={(c) => handleQrColorChange('background', c)}
          />
        </div>
      </div>

      {/* Modern Dialogs */}
      <TicketLoadDialog
        isOpen={showLoadDialog}
        onClose={() => setShowLoadDialog(false)}
        onLoad={loadFromDatabase}
        categories={categories}
      />

      <input
        type="file"
        ref={jsonInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}
