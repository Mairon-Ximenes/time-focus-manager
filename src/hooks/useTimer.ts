import { useState, useEffect, useRef } from 'react';
import { TimerState } from '@/types/task';

export function useTimer(timerState: TimerState) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!timerState.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Função para atualizar o tempo com verificação de visibilidade
    const updateTime = () => {
      const now = Date.now();
      // Se passou muito tempo desde a última atualização (usuário estava em outra aba)
      if (now - lastUpdateRef.current > 2000) {
        // Sincronizar com o tempo real
        setCurrentTime(now);
      } else {
        setCurrentTime(now);
      }
      lastUpdateRef.current = now;
    };

    // Atualizar imediatamente
    updateTime();

    // Configurar interval
    intervalRef.current = setInterval(updateTime, 1000);

    // Listener para quando a página volta a ficar visível
    const handleVisibilityChange = () => {
      if (!document.hidden && timerState.isRunning) {
        updateTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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