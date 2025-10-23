
import { EventStatus, TimeSlot } from './constants';

export interface Event {
  id: string;
  clientName: string;
  eventType: string;
  numberOfPeople: number;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  price: number;
  status: EventStatus;
}

export interface Settings {
  theme: 'light' | 'dark';
  currency: 'PKR';
  defaultGuests: number;
}

export interface AppContextType {
  events: Event[];
  settings: Settings;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}
