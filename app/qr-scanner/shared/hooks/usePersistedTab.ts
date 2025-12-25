import { useState, useEffect } from 'react';
import { TabType } from '../types';

export const usePersistedTab = () => {
    const [activeTab, setActiveTab] = useState<TabType>('checkin');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('qr-scanner-tab');
        if (saved && ['checkin', 'checkout', 'attendees', 'info'].includes(saved)) {
            setActiveTab(saved as TabType);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('qr-scanner-tab', activeTab);
        }
    }, [activeTab, initialized]);

    return { activeTab, setActiveTab, initialized };
};
