import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import LayerList from './LayerList';
import { TicketElements, TicketDetails, TicketSize, TicketElementKey, CustomTextElement, TextElementProperties } from './types';

interface TicketPropertiesPanelProps {
  activeElement: TicketElementKey | string | null;
  onSelectElement: (id: string) => void;
  ticketElements: TicketElements;
  ticketDetails: TicketDetails;
  ticketSize: TicketSize;
  onDetailChange: (field: keyof TicketDetails, value: string) => void;
  onSizeChange: (dimension: 'width' | 'height', value: string) => void;
  onToggleVisibility: (elementName: TicketElementKey | string) => void;
  onUpdateCustomText: (id: string, updates: Partial<CustomTextElement>) => void;
  onDeleteCustomText: (id: string) => void;
  onUpdateElement: (elementName: TicketElementKey, updates: Partial<any>) => void;
  qrForegroundColor: string;
  setQrForegroundColor: (color: string) => void;
  qrBackgroundColor: string;
  setQrBackgroundColor: (color: string) => void;
}

export default function TicketPropertiesPanel({
  activeElement,
  onSelectElement,
  ticketElements,
  ticketDetails,
  ticketSize,
  onDetailChange,
  onSizeChange,
  onToggleVisibility,
  onUpdateCustomText,
  onDeleteCustomText,
  onUpdateElement,
  qrForegroundColor,
  setQrForegroundColor,
  qrBackgroundColor,
  setQrBackgroundColor,
}: TicketPropertiesPanelProps) {

  const renderFontFamilyOptions = () => (
    <>
      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
      <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
      <SelectItem value="'Helvetica Neue', sans-serif">Helvetica Neue</SelectItem>
      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
      <SelectItem value="Tahoma, sans-serif">Tahoma</SelectItem>
      <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
      <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
      <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
      <SelectItem value="Lato, sans-serif">Lato</SelectItem>
      <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
      <SelectItem value="Georgia, serif">Georgia</SelectItem>
      <SelectItem value="Garamond, serif">Garamond</SelectItem>
      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
      <SelectItem value="'Brush Script MT', cursive">Brush Script</SelectItem>
    </>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-4 custom-scrollbar h-full flex flex-col">
      <div className="space-y-6 flex-1">

        {/* Helper text if no element selected */}
        {!activeElement && (
          <div className="text-sm text-gray-500 text-center py-8">
            Select an element on the canvas to edit its properties.
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-700 mb-2">Ticket Settings</h4>
              <div className="space-y-3 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Width (px)
                    </Label>
                    <Input
                      type="number"
                      value={ticketSize.width}
                      onChange={e => onSizeChange('width', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Height (px)
                    </Label>
                    <Input
                      type="number"
                      value={ticketSize.height}
                      onChange={e => onSizeChange('height', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Element Position and Size */}
        {activeElement && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
              {activeElement.startsWith('text-') ? 'Text Element' : activeElement.toString().replace(/([A-Z])/g, ' $1').trim()} Properties
            </h3>

            <div className="space-y-3">
              {/* Background Image Properties */}
              {activeElement === 'backgroundImage' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">X Position</Label>
                      <Input
                        type="number"
                        value={ticketElements.backgroundImage.x}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('backgroundImage', { x: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Y Position</Label>
                      <Input
                        type="number"
                        value={ticketElements.backgroundImage.y}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('backgroundImage', { y: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Width</Label>
                      <Input
                        type="number"
                        value={ticketElements.backgroundImage.width}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('backgroundImage', { width: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Height</Label>
                      <Input
                        type="number"
                        value={ticketElements.backgroundImage.height}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('backgroundImage', { height: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Label className="text-sm">Visible</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleVisibility('backgroundImage')}
                      className="flex items-center gap-1 h-8"
                    >
                      {ticketElements.backgroundImage.visible ? (
                        <>
                          <Eye className="h-3 w-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Hidden
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* QR Code Properties */}
              {activeElement === 'qrCode' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">X Position</Label>
                      <Input
                        type="number"
                        value={ticketElements.qrCode.x}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('qrCode', { x: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Y Position</Label>
                      <Input
                        type="number"
                        value={ticketElements.qrCode.y}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('qrCode', { y: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Width</Label>
                      <Input
                        type="number"
                        value={ticketElements.qrCode.width}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('qrCode', { width: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Height</Label>
                      <Input
                        type="number"
                        value={ticketElements.qrCode.height}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          onUpdateElement('qrCode', { height: value });
                        }}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>

                  {/* Appearance Properties for QR */}
                  <div className="pt-2 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Appearance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="checkbox"
                          checked={ticketElements.qrCode.transparentBackground}
                          onChange={e => {
                            onUpdateElement('qrCode', { transparentBackground: e.target.checked });
                          }}
                          className="h-4 w-4"
                          id="transparentBg"
                        />
                        <Label htmlFor="transparentBg" className="text-xs">Transparent Background</Label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Foreground</Label>
                          <div className="flex gap-1 mt-1">
                            <Input
                              type="color"
                              value={qrForegroundColor}
                              onChange={e => setQrForegroundColor(e.target.value)}
                              className="h-8 w-8 p-0 border-none"
                            />
                            <Input
                              type="text"
                              value={qrForegroundColor}
                              onChange={e => setQrForegroundColor(e.target.value)}
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                        {!ticketElements.qrCode.transparentBackground && (
                          <div>
                            <Label className="text-xs text-gray-600">Background</Label>
                            <div className="flex gap-1 mt-1">
                              <Input
                                type="color"
                                value={qrBackgroundColor}
                                onChange={e => setQrBackgroundColor(e.target.value)}
                                className="h-8 w-8 p-0 border-none"
                              />
                              <Input
                                type="text"
                                value={qrBackgroundColor}
                                onChange={e => setQrBackgroundColor(e.target.value)}
                                className="h-8 text-xs flex-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* QR Data */}
                  <div className="pt-2 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Data</h4>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">QR Code URL Template</Label>
                      <Input
                        value={ticketDetails.qrCode}
                        onChange={e => onDetailChange('qrCode', e.target.value)}
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label className="text-sm">Visible</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleVisibility('qrCode')}
                      className="flex items-center gap-1 h-8"
                    >
                      {ticketElements.qrCode.visible ? (
                        <>
                          <Eye className="h-3 w-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Hidden
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* Custom Text Properties */}
              {activeElement.toString().startsWith('text-') && (() => {
                const textElement = ticketElements.customTexts.find(t => t.id === activeElement);
                if (!textElement) return null;

                return (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-600">X Position</Label>
                        <Input
                          type="number"
                          value={textElement.position.x}
                          onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, x: parseInt(e.target.value) || 0 } })}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Y Position</Label>
                        <Input
                          type="number"
                          value={textElement.position.y}
                          onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, y: parseInt(e.target.value) || 0 } })}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Width</Label>
                        <Input
                          type="number"
                          value={textElement.position.width}
                          onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, width: parseInt(e.target.value) || 50 } })}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Height</Label>
                        <Input
                          type="number"
                          value={textElement.position.height}
                          onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, height: parseInt(e.target.value) || 50 } })}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="pt-2 border-t border-gray-200">
                      <Label className="text-xs font-medium text-gray-600">Content</Label>
                      <Textarea
                        value={textElement.content}
                        onChange={e => onUpdateCustomText(textElement.id, { content: e.target.value })}
                        className="mt-1 text-sm h-20"
                      />
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['{ZONE}', '{ROW}', '{SEAT}', '{NAME}', '{PRICE}'].map(ph => (
                          <button
                            key={ph}
                            onClick={() => onUpdateCustomText(textElement.id, { content: textElement.content + ph })}
                            className="text-[10px] px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200"
                          >
                            {ph}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="pt-2 border-t border-gray-200 space-y-3">
                      <h4 className="text-xs font-semibold text-gray-700">Typography</h4>
                      <div>
                        <Label className="text-xs text-gray-600">Font</Label>
                        <Select
                          value={textElement.position.fontFamily}
                          onValueChange={val => onUpdateCustomText(textElement.id, { position: { ...textElement.position, fontFamily: val } })}
                        >
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{renderFontFamilyOptions()}</SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Size</Label>
                          <Input
                            type="number"
                            value={textElement.position.fontSize}
                            onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, fontSize: parseInt(e.target.value) || 12 } })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Color</Label>
                          <div className="flex gap-1">
                            <Input
                              type="color"
                              value={textElement.position.fontColor}
                              onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, fontColor: e.target.value } })}
                              className="h-8 w-8 p-0 border-none"
                            />
                            <Input
                              type="text"
                              value={textElement.position.fontColor}
                              onChange={e => onUpdateCustomText(textElement.id, { position: { ...textElement.position, fontColor: e.target.value } })}
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-600">Weight</Label>
                          <Select
                            value={textElement.position.fontWeight || 'normal'}
                            onValueChange={val => onUpdateCustomText(textElement.id, { position: { ...textElement.position, fontWeight: val } })}
                          >
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                              <SelectItem value="100">Thin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Align</Label>
                          <Select
                            value={textElement.position.textAlign || 'left'}
                            onValueChange={val => onUpdateCustomText(textElement.id, { position: { ...textElement.position, textAlign: val } })}
                          >
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Layer List at the bottom of properties */}
        <div className="mt-auto">
          <LayerList
            ticketElements={ticketElements}
            activeElement={activeElement}
            onSelectElement={onSelectElement}
            onToggleVisibility={onToggleVisibility}
            onDeleteElement={onDeleteCustomText}
          />
        </div>
      </div>
    </div>
  );
}
