import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Save,
  Download,
  Upload,
  Database,
  MoveUp,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  ChevronDown,
  FileJson,
  FileImage,
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
  onBrowseCollection: () => void;
  onImportJSON: () => void;
  onExport: () => void;
  onExportImage: () => void;
  onAddText: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Array<{ name: string; color: string; price: number }>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

export default function TicketToolbar({
  templateName,
  setTemplateName,
  onSave,
  onLoad,
  onBrowseCollection,
  onImportJSON,
  onExport,
  onExportImage,
  onAddText,
  onImageUpload,
  categories,
  selectedCategory,
  setSelectedCategory,
  fileInputRef,
  canUndo,
  canRedo,
  undo,
  redo,
}: TicketToolbarProps) {
  return (
    <div className="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Maximize className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-none">
              TICKET DESIGNER
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Creative Suite v2</p>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-700/50 mx-2" />

        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            title="Undo (Ctrl+Z)"
          >
            <MoveUp className="h-4 w-4 -rotate-90" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            title="Redo (Ctrl+Y)"
          >
            <MoveUp className="h-4 w-4 rotate-90" />
          </Button>
        </div>

        <div className="flex flex-col gap-1 ml-2">
          <Input
            id="templateName"
            value={templateName || ""}
            onChange={e => setTemplateName(e.target.value)}
            className="h-9 bg-slate-800/50 border-slate-700/50 focus:border-indigo-500/50 text-sm w-48 text-slate-200 transition-all"
            placeholder="Template Name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 w-40 bg-slate-800/50 border-slate-700/50 text-slate-300 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 shadow-2xl">
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name} className="focus:bg-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm"
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

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-800/30 p-1 rounded-xl border border-slate-700/30">
          <Button onClick={onAddText} variant="ghost" size="sm" className="h-8 gap-2 text-slate-300 hover:text-white hover:bg-slate-700/50">
            <Plus className="h-4 w-4 text-indigo-400" />
            Add Text
          </Button>

          <Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="sm" className="h-8 gap-2 text-slate-300 hover:text-white hover:bg-slate-700/50">
            <ImageIcon className="h-4 w-4 text-purple-400" />
            Background
            <input type="file" ref={fileInputRef} onChange={onImageUpload} accept="image/*" className="hidden" />
          </Button>
        </div>

        <div className="h-6 w-px bg-slate-700/50 mx-1" />

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Button
              onClick={onLoad}
              size="sm"
              variant="ghost"
              className="h-9 gap-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-r-none px-3 border border-slate-700/50 transition-all active:scale-95"
            >
              <Database className="h-4 w-4" />
              <span className="font-semibold">Load</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 px-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50 border-l-0 rounded-l-none transition-all active:scale-95"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-slate-700 text-slate-200 shadow-2xl p-1.5 backdrop-blur-xl">
                <DropdownMenuItem onClick={onBrowseCollection} className="gap-3 py-3 px-3 focus:bg-slate-500/10 cursor-pointer rounded-lg transition-colors group">
                  <div className="p-1.5 bg-slate-500/10 rounded-md group-hover:bg-slate-500/20 transition-colors">
                    <Database className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Cloud Collection</span>
                    <span className="text-[11px] text-slate-500">Browse template library</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onImportJSON} className="gap-3 py-3 px-3 focus:bg-slate-500/10 cursor-pointer rounded-lg transition-colors group">
                  <div className="p-1.5 bg-indigo-500/10 rounded-md group-hover:bg-indigo-500/20 transition-colors">
                    <Upload className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Import JSON</span>
                    <span className="text-[11px] text-slate-500">Upload design file from your device</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center">
            <Button
              onClick={onSave}
              size="sm"
              className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] border-t border-indigo-400/30 rounded-r-none px-3 transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span className="font-semibold">Save</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-9 px-1.5 bg-indigo-700 hover:bg-indigo-600 text-white border-t border-indigo-400/30 border-l border-indigo-500/50 rounded-l-none shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition-all active:scale-95"
                >
                  <ChevronDown className="h-4 w-4 text-indigo-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-slate-700 text-slate-200 shadow-2xl p-1.5 backdrop-blur-xl">
                <DropdownMenuItem onClick={onSave} className="gap-3 py-3 px-3 focus:bg-indigo-500/20 cursor-pointer rounded-lg transition-colors group">
                  <div className="p-1.5 bg-indigo-500/10 rounded-md group-hover:bg-indigo-500/20 transition-colors">
                    <Save className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Save Design</span>
                    <span className="text-[11px] text-slate-500">Persist template to database</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-800/50 my-1.5" />

                <DropdownMenuItem onClick={onExport} className="gap-3 py-3 px-3 focus:bg-indigo-500/20 cursor-pointer rounded-lg transition-colors group">
                  <div className="p-1.5 bg-amber-500/10 rounded-md group-hover:bg-amber-500/20 transition-colors">
                    <FileJson className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Export JSON</span>
                    <span className="text-[11px] text-slate-500">Download raw project data</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onExportImage} className="gap-3 py-3 px-3 focus:bg-indigo-500/20 cursor-pointer rounded-lg transition-colors group">
                  <div className="p-1.5 bg-emerald-500/10 rounded-md group-hover:bg-emerald-500/20 transition-colors">
                    <FileImage className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Export PNG</span>
                    <span className="text-[11px] text-slate-500">Download printable image</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
