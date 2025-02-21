import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Home, TextSearch } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// I would never usually place this here
export const routes = [
  {
    icon: Home,
    title: 'Dashboard',
    url: '/',
  },
  {
    icon: TextSearch,
    title: 'About',
    url: '/about',
  },
];
