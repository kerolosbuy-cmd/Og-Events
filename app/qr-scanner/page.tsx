'use client';

import React from 'react';
import { LogIn, LogOut, Users, Info } from 'lucide-react';
import { usePersistedTab } from './shared/hooks/usePersistedTab';
import { useScannerLogic } from './shared/hooks/useScannerLogic';
import { ScannerView } from './shared/components/ScannerView';
import { AttendeesView } from './shared/components/AttendeesView';
import { SuccessToaster, ErrorOverlay, InfoOverlay } from './shared/components/Overlays';

export default function QRScannerUnifiedPage() {
    const { activeTab, setActiveTab, initialized: isTabInitialized } = usePersistedTab();

    const {
        videoRef,
        hasCamera,
        isCooldown,
        lastResult,
        setLastResult,
        lastError,
        lastInfo,
        handleContinue,
        toggleCamera
    } = useScannerLogic(activeTab);

    if (!isTabInitialized) {
        return (
            <div className="h-full flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white dark:bg-black font-sans select-none overflow-hidden text-gray-900 dark:text-white">
            {/* Global Overlays */}
            {lastError && <ErrorOverlay error={lastError} onContinue={handleContinue} />}
            {lastResult && <SuccessToaster result={lastResult} onClose={() => setLastResult(null)} />}
            {lastInfo && <InfoOverlay info={lastInfo} onContinue={handleContinue} />}

            {/* Main Content Area */}
            <main className="h-full">
                {(activeTab === 'checkin' || activeTab === 'checkout' || activeTab === 'info') && (
                    <ScannerView
                        activeTab={activeTab}
                        videoRef={videoRef}
                        hasCamera={hasCamera}
                        isCooldown={isCooldown}
                        toggleCamera={toggleCamera}
                    />
                )}
                {activeTab === 'attendees' && <AttendeesView />}
            </main>

            {/* Premium Floating Navigation - FLOATING ISLAND */}
            <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
                <nav className="pointer-events-auto flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl p-2 rounded-full border border-white/20 dark:border-gray-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
                    <NavBtn
                        active={activeTab === 'checkin'}
                        onClick={() => setActiveTab('checkin')}
                        icon={LogIn}
                        label="In"
                        color="green"
                    />
                    <NavBtn
                        active={activeTab === 'checkout'}
                        onClick={() => setActiveTab('checkout')}
                        icon={LogOut}
                        label="Out"
                        color="red"
                    />
                    <NavBtn
                        active={activeTab === 'attendees'}
                        onClick={() => setActiveTab('attendees')}
                        icon={Users}
                        label="List"
                        color="indigo"
                    />
                    <NavBtn
                        active={activeTab === 'info'}
                        onClick={() => setActiveTab('info')}
                        icon={Info}
                        label="Info"
                        color="amber"
                    />
                </nav>
            </div>
        </div>
    );
}

// --- Internal Nav Button ---
function NavBtn({ active, onClick, icon: Icon, label, color }: {
    active: boolean;
    onClick: () => void;
    icon: any;
    label: string;
    color: 'green' | 'red' | 'indigo' | 'amber'
}) {
    const colorMap = {
        green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        red: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    };

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300
                ${active ? colorMap[color] + ' border shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}
            `}
        >
            <Icon className="h-5 w-5" />
            {active && <span className="font-black uppercase text-[10px] tracking-tight">{label}</span>}
        </button>
    );
}
