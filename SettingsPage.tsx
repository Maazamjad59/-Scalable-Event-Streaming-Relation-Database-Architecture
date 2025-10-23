
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Settings } from '../types';
import Card from '../components/ui/Card';

const SettingsPage: React.FC = () => {
    const { settings, updateSettings } = useAppContext();
    const [localSettings, setLocalSettings] = useState<Settings>(settings);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({ ...prev, [name]: name === 'defaultGuests' ? Number(value) : value }));
    };

    const handleSave = () => {
        updateSettings(localSettings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <h2 className="text-xl font-semibold mb-6">Application Settings</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                        <select
                            id="theme"
                            name="theme"
                            value={localSettings.theme}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                        <select
                            id="currency"
                            name="currency"
                            value={localSettings.currency}
                            onChange={handleChange}
                            disabled
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600"
                        >
                            <option value="PKR">PKR (Pakistani Rupee)</option>
                        </select>
                         <p className="text-xs text-gray-500 mt-1">Currency is fixed for this version.</p>
                    </div>
                     <div>
                        <label htmlFor="defaultGuests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Guest Count</label>
                        <input
                            type="number"
                            id="defaultGuests"
                            name="defaultGuests"
                            value={localSettings.defaultGuests}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                        />
                         <p className="text-xs text-gray-500 mt-1">Default number of guests when creating a new booking.</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end items-center">
                    {isSaved && <span className="text-sm text-green-600 dark:text-green-400 mr-4">Settings saved!</span>}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75"
                    >
                        Save Settings
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
