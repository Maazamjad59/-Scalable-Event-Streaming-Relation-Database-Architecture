
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { EventStatus } from '../constants';

const icons = {
    CalendarDays: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M11 14h2v2h-2z"/><path d="M15 14h2v2h-2z"/><path d="M7 14h2v2H7z"/></svg>,
    Users: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    TrendingUp: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
};


const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center">
        <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 dark:text-primary-300">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </Card>
);

const DashboardPage: React.FC = () => {
    const { events, settings } = useAppContext();

    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date() && event.status === EventStatus.Active)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const totalRevenue = events
        .filter(e => e.status === EventStatus.Active)
        .reduce((sum, event) => sum + event.price, 0);

    const totalGuests = events
        .filter(e => e.status === EventStatus.Active)
        .reduce((sum, event) => sum + event.numberOfPeople, 0);
        
    const activeBookings = events.filter(e => e.status === EventStatus.Active).length;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`${settings.currency} ${new Intl.NumberFormat('en-PK').format(totalRevenue)}`} icon={<icons.TrendingUp className="w-6 h-6" />} />
                <StatCard title="Active Bookings" value={String(activeBookings)} icon={<icons.CalendarDays className="w-6 h-6" />} />
                <StatCard title="Total Guests (Active)" value={new Intl.NumberFormat('en-US').format(totalGuests)} icon={<icons.Users className="w-6 h-6" />} />
            </div>

            <div className="mt-8">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Events</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Client</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Guests</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                                    <tr key={event.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{event.clientName}</td>
                                        <td className="px-6 py-4">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}</td>
                                        <td className="px-6 py-4">{event.timeSlot}</td>
                                        <td className="px-6 py-4">{event.numberOfPeople}</td>
                                        <td className="px-6 py-4"><Badge status={event.status} /></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">No upcoming events.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
