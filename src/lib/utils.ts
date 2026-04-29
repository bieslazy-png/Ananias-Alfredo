import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const SYMPTOM_TYPES = [
  'Enjoo',
  'Fraqueza',
  'Tontura',
  'Refluxo',
  'Prisão de Ventre',
  'Diarréia',
  'Dor de Cabeça',
  'Outros',
];

export const MEDICATION_DOSES = ['0.25mg', '0.5mg', '1.0mg', '1.7mg', '2.4mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg'];
