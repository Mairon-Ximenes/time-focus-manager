import { useState, useCallback } from 'react';
import { Task, TimerState } from '@/types/task';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [timerState, setTimerState] = useLocalStorage<TimerState>('timerState', {
    isRunning: false,
    activeTaskId: null,
    startTime: null,
    elapsedTime: 0,
  });

  // Criar nova tarefa
  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeSpent' | 'status'>) => {
    if (timerState.activeTaskId) {
      throw new Error('Não é possível criar tarefas enquanto uma tarefa está ativa');
    }

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'pending',
      timeSpent: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [timerState.activeTaskId, setTasks]);

  // Editar tarefa
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    if (timerState.activeTaskId && timerState.activeTaskId !== taskId) {
      throw new Error('Não é possível editar outras tarefas enquanto uma tarefa está ativa');
    }

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: Date.now() }
        : task
    ));
  }, [timerState.activeTaskId, setTasks]);

  // Deletar tarefa
  const deleteTask = useCallback((taskId: string) => {
    if (timerState.activeTaskId === taskId) {
      // Se deletar a tarefa ativa, parar o timer
      setTimerState({
        isRunning: false,
        activeTaskId: null,
        startTime: null,
        elapsedTime: 0,
      });
    } else if (timerState.activeTaskId) {
      throw new Error('Não é possível deletar outras tarefas enquanto uma tarefa está ativa');
    }

    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [timerState.activeTaskId, setTasks, setTimerState]);

  // Iniciar tarefa
  const startTask = useCallback((taskId: string) => {
    if (timerState.activeTaskId) {
      throw new Error('Já existe uma tarefa ativa');
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === 'completed') {
      throw new Error('Tarefa não encontrada ou já está completa');
    }

    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: 'active', startTime: Date.now() }
        : t
    ));

    setTimerState({
      isRunning: true,
      activeTaskId: taskId,
      startTime: Date.now(),
      elapsedTime: task.timeSpent,
    });
  }, [tasks, timerState.activeTaskId, setTasks, setTimerState]);

  // Pausar/retomar timer
  const toggleTimer = useCallback(() => {
    if (!timerState.activeTaskId) return;

    if (timerState.isRunning) {
      // Pausar timer
      const currentTime = Date.now();
      const sessionTime = timerState.startTime ? Math.floor((currentTime - timerState.startTime) / 1000) : 0;
      const totalTime = timerState.elapsedTime + sessionTime;

      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        elapsedTime: totalTime,
      }));

      // Atualizar timeSpent da tarefa
      setTasks(prev => prev.map(task => 
        task.id === timerState.activeTaskId 
          ? { ...task, timeSpent: totalTime }
          : task
      ));
    } else {
      // Retomar timer
      setTimerState(prev => ({
        ...prev,
        isRunning: true,
        startTime: Date.now(),
      }));
    }
  }, [timerState, setTimerState, setTasks]);

  // Finalizar tarefa
  const completeTask = useCallback((taskId: string) => {
    if (timerState.activeTaskId !== taskId) {
      throw new Error('Só é possível finalizar a tarefa ativa');
    }

    // Calcular tempo final
    const currentTime = Date.now();
    const sessionTime = timerState.startTime ? Math.floor((currentTime - timerState.startTime) / 1000) : 0;
    const totalTime = timerState.elapsedTime + sessionTime;

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'completed', 
            timeSpent: totalTime,
            completedAt: currentTime,
          }
        : task
    ));

    setTimerState({
      isRunning: false,
      activeTaskId: null,
      startTime: null,
      elapsedTime: 0,
    });
  }, [timerState, setTasks, setTimerState]);

  return {
    tasks,
    timerState,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    toggleTimer,
    completeTask,
  };
}