import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Save,
  Download,
  Upload,
  Database,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Image as ImageIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRef } from 'react';

interface TicketToolbarProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onExportImage: () => void;
  onAddText: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Array<{ name: string; color: string; price: number }>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function TicketToolbar({
  templateName,
  setTemplateName,
  onSave,
  onLoad,
  onExport,
  onExportImage,
  onAddText,
  onImageUpload,
  categories,
  selectedCategory,
  setSelectedCategory,
  fileInputRef,
}: TicketToolbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Ticket Designer</h1>
          <p className="text-xs text-gray-500">Design your ticket template</p>
        </div>
        <div className="h-8 w-px bg-gray-300 mx-2" />
        <div className="flex flex-col gap-1">
          <label htmlFor="templateName" className="text-xs font-semibold text-gray-600">
            Template Name
          </label>
          <Input
            id="templateName"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            className="h-8 text-sm w-48"
            placeholder="Template Name"
          />
        </div>

        {/* Category Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAddText} variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Text
        </Button>

        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Background
          </Button>
        </div>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <Button onClick={onLoad} variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          Load
        </Button>

        <Button onClick={onSave} variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <Button onClick={onExport} variant="secondary" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export JSON
        </Button>

        <Button onClick={onExportImage} className="gap-2" size="sm">
          <Download className="h-4 w-4" />
          Export Image
        </Button>
      </div>
    </div>
  );
}
