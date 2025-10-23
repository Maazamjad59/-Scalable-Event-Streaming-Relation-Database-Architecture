
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { EventStatus } from '../constants';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const EventsListPage: React.FC = () => {
    const { events, settings } = useAppContext();
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        minPeople: '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            if (filters.status && event.status !== filters.status) return false;
            if (filters.dateFrom && new Date(event.date) < new Date(filters.dateFrom)) return false;
            if (filters.dateTo && new Date(event.date) > new Date(filters.dateTo)) return false;
            if (filters.minPeople && event.numberOfPeople < parseInt(filters.minPeople, 10)) return false;
            return true;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [events, filters]);
    
    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4">All Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <option value="">All</option>
                        {Object.values(EventStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">From</label>
                    <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">To</label>
                    <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Min. People</label>
                    <input type="number" name="minPeople" value={filters.minPeople} onChange={handleFilterChange} className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., 100"/>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Client</th>
                            <th scope="col" className="px-6 py-3">Event Type</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Time</th>
                            <th scope="col" className="px-6 py-3">Guests</th>
                            <th scope="col" className="px-6 py-3">Price ({settings.currency})</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                             <tr key={event.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{event.clientName}</td>
                                <td className="px-6 py-4">{event.eventType}</td>
                                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{event.timeSlot}</td>
                                <td className="px-6 py-4">{event.numberOfPeople}</td>
                                <td className="px-6 py-4">{new Intl.NumberFormat('en-PK').format(event.price)}</td>
                                <td className="px-6 py-4"><Badge status={event.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredEvents.length === 0 && <p className="text-center py-8 text-gray-500">No events match the current filters.</p>}
            </div>
        </Card>
    );
};

export default EventsListPage;
