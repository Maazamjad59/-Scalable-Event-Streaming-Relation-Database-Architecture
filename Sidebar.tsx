import React from 'react';
import { NavLink } from 'react-router-dom';

const icons = {
    LayoutDashboard: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
    Calendar: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>,
    List: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
    Settings: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.82l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.82l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
    Flower2: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3-3M9 8h1m4 0a3 3 0 1 1-3-3m3 3h-1m0 4a3 3 0 1 1-3 3m3-3v-1m-4 0a3 3 0 1 0-3 3m3-3v-1"/><path d="M12 12s-3.5 2-4 5"/><path d="M12 12s3.5 2 4 5"/><path d="M12 12s-2-3.5-5-4"/><path d="M12 12s2-3.5 5-4"/></svg>,
    X: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
};


const Sidebar: React.FC<{ isSidebarOpen: boolean, setIsSidebarOpen: (isOpen: boolean) => void }> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    
    const NavItem: React.FC<{ to: string, icon: React.ReactNode, children: React.ReactNode }> = ({ to, icon, children }) => {
        const baseClasses = "flex items-center px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors duration-200";
        const activeClasses = "bg-gray-700 text-white";

        return (
            <NavLink to={to} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`} onClick={() => setIsSidebarOpen(false)}>
                {icon}
                <span className="mx-4 font-medium">{children}</span>
            </NavLink>
        );
    };

    return (
        <>
            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-gray-800 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between h-20 shadow-md px-6">
                    <div className="flex items-center">
                        <icons.Flower2 className="h-8 w-8 text-pink-400" />
                        <h1 className="text-2xl font-semibold text-white ml-2">The Petals</h1>
                    </div>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation menu">
                       <icons.X className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav>
                        <NavItem to="/dashboard" icon={<icons.LayoutDashboard className="h-6 w-6" />}>Dashboard</NavItem>
                        <NavItem to="/calendar" icon={<icons.Calendar className="h-6 w-6" />}>Calendar</NavItem>
                        <NavItem to="/events" icon={<icons.List className="h-6 w-6" />}>Events</NavItem>
                        <NavItem to="/settings" icon={<icons.Settings className="h-6 w-6" />}>Settings</NavItem>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;