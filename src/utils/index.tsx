import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
}

const generateUUID = () => crypto.randomUUID();

export {
    generateUUID,
    cn,
};