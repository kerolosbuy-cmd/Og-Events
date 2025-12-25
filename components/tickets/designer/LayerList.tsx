import { Button } from '@/components/ui/button';
import { Eye, EyeOff, GripVertical, Trash2, Type, QrCode, ImageIcon } from 'lucide-react';
import { TicketElements, TicketElementKey } from './types';

interface LayerListProps {
    ticketElements: TicketElements;
    activeElement: TicketElementKey | string | null;
    onSelectElement: (id: TicketElementKey | string | null) => void;
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
        {
            id: 'backgroundImage',
            name: 'Background Image',
            icon: <ImageIcon className="h-4 w-4" />,
            visible: ticketElements.backgroundImage.visible
        },
        {
            id: 'qrCode',
            name: 'QR Code',
            icon: <QrCode className="h-4 w-4" />,
            visible: ticketElements.qrCode.visible
        },
        ...ticketElements.customTexts.map(text => ({
            id: text.id,
            name: text.content || 'Untitled Text',
            icon: <Type className="h-4 w-4" />,
            visible: true,
            isText: true
        })).reverse(),
    ];

    return (
        <div className="flex flex-col bg-slate-900 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {layers.map(layer => (
                    <div
                        key={layer.id}
                        onClick={() => onSelectElement(layer.id)}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-2 group ${activeElement === layer.id
                                ? 'bg-indigo-500/10 border-indigo-500 text-slate-100'
                                : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <GripVertical className="h-3 w-3 text-slate-600 flex-shrink-0" />
                            <div className={`p-1.5 rounded-md ${activeElement === layer.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                                {layer.icon}
                            </div>
                            <span className="text-xs font-medium truncate max-w-[140px]">
                                {layer.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                            {layer.id === 'backgroundImage' || layer.id === 'qrCode' ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-7 w-7 transition-colors ${layer.visible ? 'text-slate-500 hover:text-white' : 'text-red-500/50 hover:text-red-500'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleVisibility(layer.id);
                                    }}
                                >
                                    {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteElement(layer.id);
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
