import { useContext } from 'react';
import { LabelContext } from '@/app/contexts/LabelContext';

export const useLabel = () => {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error('useLabel deve ser usado dentro de um LabelProvider');
  }
  return context;
};
