"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Clock,
    CheckCircle,
    History,
    Ticket,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Eye,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { logout } from '@/app/og-admin/actions';

const sidebarItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/og-admin',
    },
    {
        title: 'Pending Bookings',
        icon: Clock,
        href: '/og-admin/pending-bookings',
    },
    {
        title: 'Approved Orders',
        icon: CheckCircle,
        href: '/og-admin/booked-orders',
    },
    {
        title: 'All Bookings',
        icon: History,
        href: '/og-admin/bookings',
    },
    {
        title: 'Ticket Designer',
        icon: Ticket,
        href: '/og-admin/tickets',
    },
    {
        title: 'Category Visibility',
        icon: Eye,
        href: '/og-admin/settings/visibility',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/og-admin/settings',
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/50 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-xl",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                            <Sparkles size={16} className="text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "hover:bg-primary/10 transition-all duration-200",
                        collapsed && "mx-auto"
                    )}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                                    : "hover:bg-gradient-to-r hover:from-muted hover:to-muted/50 text-muted-foreground hover:text-foreground hover:scale-[1.01]",
                                collapsed && "justify-center px-0"
                            )}>
                                {/* Active indicator */}
                                {isActive && !collapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                                )}

                                <item.icon
                                    size={20}
                                    className={cn(
                                        "transition-transform duration-200",
                                        !isActive && "group-hover:scale-110"
                                    )}
                                />
                                {!collapsed && (
                                    <span className="font-medium text-sm whitespace-nowrap">
                                        {item.title}
                                    </span>
                                )}

                                {/* Hover glow effect */}
                                {!isActive && (
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
                <form action={logout}>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full flex items-center gap-3 justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-[1.02]",
                            collapsed && "justify-center px-0"
                        )}
                        type="submit"
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </Button>
                </form>
            </div>
        </aside>
    );
}
