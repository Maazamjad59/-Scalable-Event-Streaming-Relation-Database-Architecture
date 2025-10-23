import React from 'react';
import { useLocation } from 'react-router-dom';

const icons = {
    Menu: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
};

const Header: React.FC<{ setIsSidebarOpen: (isOpen: boolean) => void }> = ({ setIsSidebarOpen }) => {
    const location = useLocation();
    const getTitle = () => {
        const path = location.pathname.replace('/', '');
        if (path === '' || path === 'dashboard') return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
    return (
        <header className="flex justify-between items-center p-4 sm:p-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center">
                 <button 
                    className="text-gray-500 dark:text-gray-300 focus:outline-none md:hidden" 
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open navigation menu"
                 >
                    <icons.Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 md:ml-0 ml-4">{getTitle()}</h1>
            </div>
        </header>
    );
};

export default Header;