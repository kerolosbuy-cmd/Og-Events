import React from 'react';
import { LogIn, LogOut, Info, AlertCircle } from 'lucide-react';
import { TabType } from '../types';

interface ScannerViewProps {
    activeTab: TabType;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    hasCamera: boolean;
    isCooldown: boolean;
}

export const ScannerView = ({ activeTab, videoRef, hasCamera, isCooldown }: ScannerViewProps) => {
    const isCheckIn = activeTab === 'checkin';
    const isInfo = activeTab === 'info';
    const Icon = isInfo ? Info : (isCheckIn ? LogIn : LogOut);

    const headerBg = isInfo ? 'bg-amber-600' : (isCheckIn ? 'bg-emerald-600' : 'bg-rose-600');
    const footerBg = isInfo ? 'bg-amber-500/20' : (isCheckIn ? (isCooldown ? 'bg-amber-500/20' : 'bg-emerald-500/20') : (isCooldown ? 'bg-amber-500/20' : 'bg-rose-500/20'));
    const footerBorder = isInfo ? 'border-amber-500/30' : (isCheckIn ? (isCooldown ? 'border-amber-500/30' : 'border-emerald-500/30') : (isCooldown ? 'border-amber-500/30' : 'border-rose-500/30'));
    const footerText = isInfo ? 'text-amber-400' : (isCheckIn ? (isCooldown ? 'text-amber-400' : 'text-emerald-400') : (isCooldown ? 'text-amber-400' : 'text-rose-400'));
    const dotBg = isInfo ? 'bg-amber-500' : (isCheckIn ? (isCooldown ? 'bg-amber-500' : 'bg-emerald-500') : (isCooldown ? 'bg-amber-500' : 'bg-rose-500'));
    const cornerBorder = isInfo ? 'border-amber-500' : (isCheckIn ? 'border-emerald-500' : 'border-rose-500');
    const scannerLightBg = isInfo ? 'bg-amber-400' : (isCheckIn ? 'bg-emerald-400' : 'bg-rose-400');
    const scannerLightShadow = isInfo ? 'shadow-amber-500/50' : (isCheckIn ? 'shadow-emerald-500/50' : 'shadow-rose-500/50');

    return (
        <div className="flex flex-col h-full bg-black relative overflow-hidden">
            {/* Top Status Bar - RICH COLORED HEADER */}
            <div className={`p-6 pt-12 pb-8 ${headerBg} relative overflow-hidden text-white z-10 shadow-2xl`}>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center gap-4 mb-3 relative z-10">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none whitespace-nowrap">
                            {isInfo ? 'InfoScan' : (isCheckIn ? 'Check In' : 'Check Out')}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Device Active</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 opacity-80 relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <p className="text-[11px] font-bold uppercase tracking-widest leading-none">Position QR inside the frame</p>
                </div>
            </div>

            {/* Camera Container */}
            <div className="flex-1 relative flex items-center justify-center">
                {!hasCamera ? (
                    <div className="text-white text-center p-8">
                        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-xl font-bold">No Camera Found</h2>
                        <p className="opacity-70">Please check your permissions and try again.</p>
                    </div>
                ) : (
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                )}

                {/* Scan Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 relative">
                        {/* Animated Corners */}
                        <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${cornerBorder} rounded-tl-xl`} />
                        <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${cornerBorder} rounded-tr-xl`} />
                        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${cornerBorder} rounded-bl-xl`} />
                        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${cornerBorder} rounded-br-xl`} />

                        {/* Scanning Light */}
                        <div className={`absolute w-full h-1 ${scannerLightBg} shadow-[0_0_20px] ${scannerLightShadow} animate-scanner-line top-0`} />
                    </div>
                </div>
            </div>

            {/* Bottom Instruction Pill - Overlaid */}
            <div className="pb-32 pt-8 flex justify-center relative z-10 pointer-events-none">
                <div className={`pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-2xl backdrop-blur-md ${footerBg} ${footerBorder} ${footerText}`}>
                    <div className={`w-2 h-2 rounded-full ${dotBg} ${isCooldown ? '' : 'animate-pulse'}`} />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">
                        {isCooldown ? 'Cooldown (2s)' : 'Scanner Active'}
                    </span>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scanner-line {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scanner-line {
                    animation: scanner-line 3s linear infinite;
                }
            `}</style>
        </div>
    );
};
