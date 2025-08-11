import React from 'react';
import { Task, TimerState } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskForm } from '@/components/AddTaskForm';
import { formatDateISO } from '@/utils/dateUtils';

interface DayViewProps {
  selectedDate: Date;
  tasks: Task[];
  timerState: TimerState;
  onCreateTask: (title: string, description: string, date: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
  onToggleTimer: () => void;
  onCompleteTask: (taskId: string) => void;
}

export function DayView({
  selectedDate,
  tasks,
  timerState,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onStartTask,
  onToggleTimer,
  onCompleteTask
}: DayViewProps) {
  const selectedDateISO = formatDateISO(selectedDate);
  const dayTasks = tasks.filter(task => task.date === selectedDateISO);
  const isLocked = !!timerState.activeTaskId;

  // Separar tarefas por status para melhor organização
  const pendingTasks = dayTasks.filter(task => task.status === 'pending');
  const activeTasks = dayTasks.filter(task => task.status === 'active');
  const completedTasks = dayTasks.filter(task => task.status === 'completed');

  // Ordenar por data de criação
  const sortedPendingTasks = pendingTasks.sort((a, b) => a.createdAt - b.createdAt);
  const sortedCompletedTasks = completedTasks.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <div className="space-y-6">
      {/* Formulário para adicionar nova tarefa */}
      <AddTaskForm
        selectedDate={selectedDate}
        onAddTask={onCreateTask}
        isLocked={isLocked}
      />

      {/* Tarefas Ativas */}
      {activeTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-warning flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            Tarefa Ativa
          </h3>
          {activeTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              timerState={timerState}
              onStart={onStartTask}
              onToggleTimer={onToggleTimer}
              onComplete={onCompleteTask}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              isLocked={false}
            />
          ))}
        </div>
      )}

      {/* Tarefas Pendentes */}
      {sortedPendingTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Tarefas Pendentes ({sortedPendingTasks.length})
          </h3>
          <div className="grid gap-4">
            {sortedPendingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                timerState={timerState}
                onStart={onStartTask}
                onToggleTimer={onToggleTimer}
                onComplete={onCompleteTask}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                isLocked={isLocked}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tarefas Concluídas */}
      {sortedCompletedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-success">
            Tarefas Concluídas ({sortedCompletedTasks.length})
          </h3>
          <div className="grid gap-4">
            {sortedCompletedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                timerState={timerState}
                onStart={onStartTask}
                onToggleTimer={onToggleTimer}
                onComplete={onCompleteTask}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                isLocked={isLocked}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {dayTasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhuma tarefa para este dia</p>
          <p className="text-sm">Comece adicionando uma nova tarefa acima</p>
        </div>
      )}
    </div>
  );
}