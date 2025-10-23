
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Event, Settings } from '../types';
import { EventStatus, TimeSlot } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialEvents: Event[] = [
    { id: '1', clientName: 'Asif & Ayesha', eventType: 'Wedding', numberOfPeople: 300, date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], timeSlot: TimeSlot.Night, price: 500000, status: EventStatus.Active },
    { id: '2', clientName: 'TechCorp', eventType: 'Corporate Dinner', numberOfPeople: 150, date: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString().split('T')[0], timeSlot: TimeSlot.Night, price: 250000, status: EventStatus.Active },
    { id: '3', clientName: 'Bilal Ahmed', eventType: 'Birthday Party', numberOfPeople: 80, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], timeSlot: TimeSlot.Day, price: 120000, status: EventStatus.Cancelled },
    { id: '4', clientName: 'Fatima\'s Aqiqah', eventType: 'Aqiqah', numberOfPeople: 200, date: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0], timeSlot: TimeSlot.Day, price: 200000, status: EventStatus.Pending },
    { id: '5', clientName: 'University Gala', eventType: 'Gala', numberOfPeople: 500, date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], timeSlot: TimeSlot.Night, price: 750000, status: EventStatus.Active },
];


const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>(() => {
        const savedEvents = localStorage.getItem('banquetEvents');
        return savedEvents ? JSON.parse(savedEvents) : initialEvents;
    });

    const [settings, setSettings] = useState<Settings>(() => {
        const savedSettings = localStorage.getItem('banquetSettings');
        return savedSettings ? JSON.parse(savedSettings) : { theme: 'light', currency: 'PKR', defaultGuests: 100 };
    });

    useEffect(() => {
        localStorage.setItem('banquetEvents', JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem('banquetSettings', JSON.stringify(settings));
    }, [settings]);

    const addEvent = (event: Omit<Event, 'id'>) => {
        const newEvent = { ...event, id: new Date().toISOString() };
        setEvents(prev => [...prev, newEvent]);
    };

    const updateEvent = (updatedEvent: Event) => {
        setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({...prev, ...newSettings}));
    };

    return (
        <AppContext.Provider value={{ events, settings, addEvent, updateEvent, updateSettings }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppProvider, AppContext };
