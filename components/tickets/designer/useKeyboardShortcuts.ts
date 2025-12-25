import { useEffect } from 'react';

interface KeyboardShortcutsProps {
    undo: () => void;
    redo: () => void;
    save: () => void;
    deleteElement: () => void;
    nudge: (dx: number, dy: number) => void;
    activeElement: any;
}

export function useKeyboardShortcuts({
    undo,
    redo,
    save,
    deleteElement,
    nudge,
    activeElement,
}: KeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if focus is in an input or textarea
            if (
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA'
            ) {
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
            const shiftKey = e.shiftKey;

            // Undo: Ctrl + Z
            if (ctrlKey && e.key.toLowerCase() === 'z' && !shiftKey) {
                e.preventDefault();
                undo();
            }

            // Redo: Ctrl + Y or Ctrl + Shift + Z
            if (
                (ctrlKey && e.key.toLowerCase() === 'y') ||
                (ctrlKey && shiftKey && e.key.toLowerCase() === 'z')
            ) {
                e.preventDefault();
                redo();
            }

            // Save: Ctrl + S
            if (ctrlKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                save();
            }

            // Delete: Delete or Backspace
            if (activeElement && (e.key === 'Delete' || e.key === 'Backspace')) {
                e.preventDefault();
                deleteElement();
            }

            // Nudge: Arrow keys
            if (activeElement && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const amount = shiftKey ? 10 : 1;
                let dx = 0;
                let dy = 0;

                if (e.key === 'ArrowUp') dy = -amount;
                if (e.key === 'ArrowDown') dy = amount;
                if (e.key === 'ArrowLeft') dx = -amount;
                if (e.key === 'ArrowRight') dx = amount;

                nudge(dx, dy);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, save, deleteElement, nudge, activeElement]);
}
