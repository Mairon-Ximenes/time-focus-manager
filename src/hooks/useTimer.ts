import { useState, useEffect } from 'react';
import { TimerState } from '@/types/task';

export function useTimer(timerState: TimerState) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!timerState.isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  // Calcular tempo atual da sessão
  const getCurrentSessionTime = () => {
    if (!timerState.isRunning || !timerState.startTime) return 0;
    return Math.floor((currentTime - timerState.startTime) / 1000);
  };

  // Calcular tempo total (tempo anterior + sessão atual)
  const getTotalTime = () => {
    return timerState.elapsedTime + getCurrentSessionTime();
  };

  // Formatar tempo em HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    currentSessionTime: getCurrentSessionTime(),
    totalTime: getTotalTime(),
    formatTime,
  };
}