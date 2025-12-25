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
    Eye
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
                "flex flex-col h-screen bg-card border-r transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b">
                {!collapsed && <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Admin Panel</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 p-3 rounded-md transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-accent text-muted-foreground hover:text-accent-foreground",
                                collapsed && "justify-center px-0"
                            )}>
                                <item.icon size={20} />
                                {!collapsed && <span className="font-medium whitespace-nowrap">{item.title}</span>}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <form action={logout}>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full flex items-center gap-3 justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
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
