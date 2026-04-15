import { createContext, useContext, ReactNode } from 'react';
import { useFitTrack } from '../hooks/useFitTrack';

type FitTrackContextType = ReturnType<typeof useFitTrack>;

const FitTrackContext = createContext<FitTrackContextType | null>(null);

export function FitTrackProvider({ children }: { children: ReactNode }) {
  const fitTrackData = useFitTrack();

  return (
    <FitTrackContext.Provider value={fitTrackData}>
      {children}
    </FitTrackContext.Provider>
  );
}

export function useFitTrackContext() {
  const context = useContext(FitTrackContext);
  if (!context) {
    throw new Error('useFitTrackContext must be used within FitTrackProvider');
  }
  return context;
}
