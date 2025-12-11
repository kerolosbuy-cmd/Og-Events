import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface TicketSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  categories: Array<{ name: string; color: string; price: number }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  templateName: string;
  onTemplateNameChange: (name: string) => void;
}

export function TicketSaveDialog({
  isOpen,
  onClose,
  onSave,
  categories,
  selectedCategory,
  onSelectCategory,
  templateName,
  onTemplateNameChange,
}: TicketSaveDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Ticket Template</DialogTitle>
          <DialogDescription>
            Save your design as a template for a specific category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={templateName}
              onChange={e => onTemplateNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={selectedCategory} onValueChange={onSelectCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TicketLoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (template: any) => void;
  categories: Array<{ name: string; color: string; price: number; templates?: any[] }>;
}

export function TicketLoadDialog({
  isOpen,
  onClose,
  onLoad,
  categories,
}: TicketLoadDialogProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Flatten templates from categories for easy selection
  const allTemplates = categories.flatMap(cat =>
    (cat.templates || []).map(t => ({ ...t, categoryName: cat.name }))
  );

  const handleLoad = () => {
    const template = allTemplates.find(t => t.id === selectedTemplateId || t.name === selectedTemplateId); // logic depends on ID availability
    if (template) {
      onLoad(template);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load Ticket Template</DialogTitle>
          <DialogDescription>
            Select a saved template to load.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {allTemplates.length === 0 ? (
                <SelectItem value="none" disabled>No saved templates</SelectItem>
              ) : (
                allTemplates.map((t, idx) => (
                  <SelectItem key={t.id || idx} value={t.id || t.name}>
                    {t.name} ({t.categoryName})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleLoad} disabled={!selectedTemplateId}>Load</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
