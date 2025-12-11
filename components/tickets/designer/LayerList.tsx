import { Button } from '@/components/ui/button';
import { Eye, EyeOff, MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { TicketElements, TicketElementKey, CustomTextElement } from './types';

interface LayerListProps {
    ticketElements: TicketElements;
    activeElement: TicketElementKey | string | null;
    onSelectElement: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    onDeleteElement: (id: string) => void;
}

export default function LayerList({
    ticketElements,
    activeElement,
    onSelectElement,
    onToggleVisibility,
    onDeleteElement,
}: LayerListProps) {

    const layers = [
        ...ticketElements.customTexts.map((text) => ({
            id: text.id,
            name: text.content || 'Text Element',
            type: 'text',
            visible: true,
        })).reverse(),
        {
            id: 'qrCode',
            name: 'QR Code',
            type: 'system',
            visible: ticketElements.qrCode.visible,
        },
        {
            id: 'backgroundImage',
            name: 'Background Image',
            type: 'system',
            visible: ticketElements.backgroundImage.visible,
        },
    ];

    return (
        <div className="mt-6 border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-700 mb-3 text-sm">Layers</h4>
            <div className="h-[200px] overflow-y-auto border border-gray-100 rounded-md">
                <div className="space-y-1 p-2">
                    {layers.map((layer) => (
                        <div
                            key={layer.id}
                            className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer ${activeElement === layer.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-gray-50'
                                }`}
                            onClick={() => onSelectElement(layer.id)}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span className="truncate max-w-[120px]">{layer.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {layer.type !== 'text' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleVisibility(layer.id);
                                        }}
                                    >
                                        {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                    </Button>
                                )}
                                {layer.type === 'text' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteElement(layer.id);
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
