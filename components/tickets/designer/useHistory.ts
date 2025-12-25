import { useState, useCallback, useRef } from 'react';

export function useHistory<T>(initialState: T) {
    const [state, _setState] = useState<T>(initialState);
    const historyRef = useRef<T[]>([initialState]);
    const pointerRef = useRef<number>(0);

    const setHistoryState = useCallback((nextState: T | ((prev: T) => T), saveToHistory = true) => {
        _setState((prev) => {
            const resolvedState = typeof nextState === 'function' ? (nextState as Function)(prev) : nextState;

            if (saveToHistory) {
                // Remove anyway forward history
                const newHistory = historyRef.current.slice(0, pointerRef.current + 1);
                newHistory.push(resolvedState);

                // Limit history size to 50
                if (newHistory.length > 50) {
                    newHistory.shift();
                } else {
                    pointerRef.current++;
                }

                historyRef.current = newHistory;
            }

            return resolvedState;
        });
    }, []);

    const undo = useCallback(() => {
        if (pointerRef.current > 0) {
            pointerRef.current--;
            const prevState = historyRef.current[pointerRef.current];
            _setState(prevState);
            return true;
        }
        return false;
    }, []);

    const redo = useCallback(() => {
        if (pointerRef.current < historyRef.current.length - 1) {
            pointerRef.current++;
            const nextState = historyRef.current[pointerRef.current];
            _setState(nextState);
            return true;
        }
        return false;
    }, []);

    return {
        state,
        setState: setHistoryState,
        undo,
        redo,
        canUndo: pointerRef.current > 0,
        canRedo: pointerRef.current < historyRef.current.length - 1,
    };
}
