import { useState, useEffect, useRef } from 'react';
import { TimerState } from '@/types/task';

// Chaves para localStorage
const TIMER_KEYS = {
  START_TIME: 'tfm.startTime',
  PAUSED_ACCUMULATED: 'tfm.pausedAccumulated',
  LAST_UPDATE: 'tfm.lastUpdate'
} as const;

export function useTimer(timerState: TimerState) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  // Salvar estado no localStorage quando timer inicia
  useEffect(() => {
    if (timerState.isRunning && timerState.startTime) {
      localStorage.setItem(TIMER_KEYS.START_TIME, timerState.startTime.toString());
      localStorage.setItem(TIMER_KEYS.PAUSED_ACCUMULATED, timerState.elapsedTime.toString());
      localStorage.setItem(TIMER_KEYS.LAST_UPDATE, Date.now().toString());
    } else if (!timerState.isRunning) {
      // Limpar estado quando timer para
      localStorage.removeItem(TIMER_KEYS.START_TIME);
      localStorage.removeItem(TIMER_KEYS.PAUSED_ACCUMULATED);
      localStorage.removeItem(TIMER_KEYS.LAST_UPDATE);
    }
  }, [timerState.isRunning, timerState.startTime, timerState.elapsedTime]);

  useEffect(() => {
    if (!timerState.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Função para atualizar o tempo com verificação de persistência
    const updateTime = () => {
      const now = Date.now();
      
      // Verificar se existe estado salvo no localStorage
      const savedStartTime = localStorage.getItem(TIMER_KEYS.START_TIME);
      const savedPausedAccum = localStorage.getItem(TIMER_KEYS.PAUSED_ACCUMULATED);
      const savedLastUpdate = localStorage.getItem(TIMER_KEYS.LAST_UPDATE);
      
      if (savedStartTime && savedPausedAccum && timerState.startTime) {
        const startTime = Number(savedStartTime);
        const pausedAccum = Number(savedPausedAccum);
        const lastUpdate = Number(savedLastUpdate || startTime);
        
        // Detectar se houve gap temporal (usuário esteve ausente)
        const timeSinceLastUpdate = now - lastUpdateRef.current;
        
        if (timeSinceLastUpdate > 5000) {
          // Gap detectado - recalcular baseado no timestamp salvo
          console.log('Timer gap detected, recalculating from saved state');
        }
        
        // Atualizar timestamp de última verificação
        localStorage.setItem(TIMER_KEYS.LAST_UPDATE, now.toString());
      }
      
      setCurrentTime(now);
      lastUpdateRef.current = now;
    };

    // Atualizar imediatamente
    updateTime();

    // Configurar interval mais preciso
    intervalRef.current = setInterval(updateTime, 1000);

    // Listener para quando a página volta a ficar visível
    const handleVisibilityChange = () => {
      if (!document.hidden && timerState.isRunning) {
        console.log('Page became visible, syncing timer');
        updateTime();
      }
    };

    // Listener para detectar focus da janela
    const handleFocus = () => {
      if (timerState.isRunning) {
        console.log('Window focused, syncing timer');
        updateTime();
      }
    };

    // Adicionar todos os listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [timerState.isRunning, timerState.startTime]);

  // Calcular tempo atual da sessão com verificação de persistência
  const getCurrentSessionTime = () => {
    if (!timerState.isRunning || !timerState.startTime) return 0;
    
    // Verificar localStorage para estado mais preciso
    const savedStartTime = localStorage.getItem(TIMER_KEYS.START_TIME);
    const savedPausedAccum = localStorage.getItem(TIMER_KEYS.PAUSED_ACCUMULATED);
    
    if (savedStartTime && savedPausedAccum) {
      const startTime = Number(savedStartTime);
      const pausedAccum = Number(savedPausedAccum);
      const sessionTime = Math.floor((currentTime - startTime) / 1000);
      return Math.max(0, sessionTime);
    }
    
    // Fallback para método original
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