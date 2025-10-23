
import React, { useState, useMemo, useCallback } from 'react';
// FIX: Import startOfMonth and subMonths from their specific paths to resolve export errors.
import { format, endOfMonth, eachDayOfInterval, getDay, addMonths, isSameDay } from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';
import { useAppContext } from '../hooks/useAppContext';
import { EventStatus, TimeSlot } from '../constants';
import { Event } from '../types';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const icons = {
    ChevronLeft: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>,
    ChevronRight: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
};

const BookingModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    eventData: Partial<Event> | null,
    onSave: (event: Omit<Event, 'id'> | Event) => void
}> = ({ isOpen, onClose, eventData, onSave }) => {
    const [formData, setFormData] = useState<Omit<Event, 'id'> | Event | null>(null);

    React.useEffect(() => {
        if (eventData) {
            setFormData(eventData as any);
        }
    }, [eventData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: name === 'price' || name === 'numberOfPeople' ? Number(value) : value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
            onClose();
        }
    };
    
    if (!formData) return null;

    return (
        // Fix: Use 'in' operator as a type guard to check for the existence of 'id' on the union type.
        <Modal isOpen={isOpen} onClose={onClose} title={'id' in formData ? 'Edit Event' : 'Book Event'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
                    <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Event Type</label>
                    <input type="text" name="eventType" value={formData.eventType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Number of People</label>
                    <input type="number" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Price (PKR)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        {Object.values(EventStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700">Save</button>
                </div>
            </form>
        </Modal>
    );
};

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventData, setSelectedEventData] = useState<Partial<Event> | null>(null);

    const { events, addEvent, updateEvent, settings } = useAppContext();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDayIndex = getDay(monthStart);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, { [key in TimeSlot]?: Event }>();
        events.forEach(event => {
            const dateStr = format(new Date(event.date), 'yyyy-MM-dd');
            if (!map.has(dateStr)) {
                map.set(dateStr, {});
            }
            // Allow override if cancelled
            const existingEvent = map.get(dateStr)![event.timeSlot];
            if (!existingEvent || existingEvent.status === EventStatus.Cancelled) {
                 map.get(dateStr)![event.timeSlot] = event;
            }
        });
        return map;
    }, [events]);

    const handleSlotClick = (day: Date, timeSlot: TimeSlot) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const event = eventsByDate.get(dateStr)?.[timeSlot];
        if (event) {
            setSelectedEventData(event);
        } else {
            setSelectedEventData({
                clientName: '',
                eventType: '',
                numberOfPeople: settings.defaultGuests,
                date: dateStr,
                timeSlot,
                price: 0,
                status: EventStatus.Pending,
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveEvent = useCallback((event: Omit<Event, 'id'> | Event) => {
        if ('id' in event) {
            updateEvent(event);
        } else {
            addEvent(event);
        }
    }, [addEvent, updateEvent]);
    
    const renderEvent = (day: Date, timeSlot: TimeSlot) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const event = events.filter(e => isSameDay(new Date(e.date), day) && e.timeSlot === timeSlot).sort((a,b) => (a.status === EventStatus.Cancelled ? 1 : -1))[0];
        if (!event) return <div className="text-xs text-gray-400 dark:text-gray-500">{timeSlot}</div>;
        
        const statusClasses: Record<EventStatus, string> = {
            [EventStatus.Active]: 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500',
            [EventStatus.Pending]: 'bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500',
            [EventStatus.Cancelled]: 'bg-red-100 dark:bg-red-900 border-l-4 border-red-500 opacity-60',
        };

        return (
             <div className={`p-1 rounded-sm text-xs ${statusClasses[event.status]}`}>
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{event.clientName}</p>
                <p className="text-gray-600 dark:text-gray-400 truncate">{event.eventType}</p>
             </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <icons.ChevronLeft className="w-6 h-6"/>
                </button>
                <h2 className="text-xl sm:text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <icons.ChevronRight className="w-6 h-6"/>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-px text-center text-sm font-semibold border-t border-l border-gray-200 dark:border-gray-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 bg-gray-50 dark:bg-gray-700/80 border-b border-r border-gray-200 dark:border-gray-600">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                ))}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-b border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50"></div>
                ))}
                {days.map(day => (
                    <div key={day.toString()} className="relative min-h-[90px] sm:min-h-[100px] border-b border-r border-gray-200 dark:border-gray-600 flex flex-col">
                        <span className="absolute top-1 right-2 text-xs font-medium text-gray-500 dark:text-gray-400">{format(day, 'd')}</span>
                        <div className="flex-1 flex flex-col justify-around pt-5 sm:pt-4">
                            <div onClick={() => handleSlotClick(day, TimeSlot.Day)} className="cursor-pointer h-1/2 flex items-center justify-center p-1 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors duration-200">
                                {renderEvent(day, TimeSlot.Day)}
                            </div>
                             <div className="border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                            <div onClick={() => handleSlotClick(day, TimeSlot.Night)} className="cursor-pointer h-1/2 flex items-center justify-center p-1 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors duration-200">
                                {renderEvent(day, TimeSlot.Night)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} eventData={selectedEventData} onSave={handleSaveEvent} />
        </div>
    );
};

export default CalendarPage;