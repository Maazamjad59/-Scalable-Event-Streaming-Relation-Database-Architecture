
import React from 'react';
import { EventStatus } from '../../constants';

interface BadgeProps {
    status: EventStatus;
}

const statusColors: Record<EventStatus, string> = {
    [EventStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [EventStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [EventStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const Badge: React.FC<BadgeProps> = ({ status }) => {
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
            {status}
        </span>
    );
};

export default Badge;
