import React from 'react';
import { Task, TimerState } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskForm } from '@/components/AddTaskForm';
import { getWeekDays, formatDate, formatDateISO, isTodayUtil } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  selectedDate: Date;
  tasks: Task[];
  timerState: TimerState;
  onCreateTask: (title: string, description: string, date: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
  onToggleTimer: () => void;
  onCompleteTask: (taskId: string) => void;
  onDaySelect: (date: Date) => void;
}

export function WeekView({
  selectedDate,
  tasks,
  timerState,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onStartTask,
  onToggleTimer,
  onCompleteTask,
  onDaySelect
}: WeekViewProps) {
  const weekDays = getWeekDays(selectedDate);
  const isLocked = !!timerState.activeTaskId;

  const getTasksForDay = (date: Date) => {
    const dateISO = formatDateISO(date);
    return tasks.filter(task => task.date === dateISO);
  };

  const getTaskCountSummary = (dayTasks: Task[]) => {
    const pending = dayTasks.filter(t => t.status === 'pending').length;
    const active = dayTasks.filter(t => t.status === 'active').length;
    const completed = dayTasks.filter(t => t.status === 'completed').length;
    return { pending, active, completed, total: dayTasks.length };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {weekDays.map((day, index) => {
        const dayTasks = getTasksForDay(day);
        const taskSummary = getTaskCountSummary(dayTasks);
        const isToday = isTodayUtil(day);
        const hasActiveTasks = taskSummary.active > 0;

        return (
          <Card 
            key={index}
            className={cn(
              'transition-all duration-200 hover:shadow-lg cursor-pointer',
              isToday && 'ring-2 ring-primary ring-offset-2',
              hasActiveTasks && 'shadow-md shadow-warning/20'
            )}
            onClick={() => onDaySelect(day)}
          >
            <CardHeader className="pb-3">
              <CardTitle className={cn(
                'text-lg flex items-center justify-between',
                isToday && 'text-primary'
              )}>
                <span>{formatDate(day, 'EEE')}</span>
                <span className="text-2xl font-bold">
                  {formatDate(day, 'dd')}
                </span>
              </CardTitle>
              {isToday && (
                <div className="text-sm text-primary font-medium">Hoje</div>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Resumo de tarefas */}
              {taskSummary.total > 0 && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {taskSummary.pending > 0 && (
                    <div className="bg-muted rounded px-2 py-1 text-center">
                      <div className="font-semibold">{taskSummary.pending}</div>
                      <div>Pendente{taskSummary.pending > 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {taskSummary.active > 0 && (
                    <div className="bg-warning/20 text-warning-foreground rounded px-2 py-1 text-center">
                      <div className="font-semibold">{taskSummary.active}</div>
                      <div>Ativa{taskSummary.active > 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {taskSummary.completed > 0 && (
                    <div className="bg-success/20 text-success-foreground rounded px-2 py-1 text-center">
                      <div className="font-semibold">{taskSummary.completed}</div>
                      <div>Concluída{taskSummary.completed > 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Lista simplificada de tarefas */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={cn(
                      'text-sm p-2 rounded border-l-4 bg-muted/50',
                      task.status === 'pending' && 'border-l-muted-foreground',
                      task.status === 'active' && 'border-l-warning bg-warning/10',
                      task.status === 'completed' && 'border-l-success bg-success/10 line-through text-muted-foreground'
                    )}
                  >
                    <div className="font-medium truncate">{task.title}</div>
                    {task.timeSpent > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.floor(task.timeSpent / 60)}min
                      </div>
                    )}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{dayTasks.length - 3} mais
                  </div>
                )}
              </div>

              {/* Indicador se não há tarefas */}
              {taskSummary.total === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4 border-2 border-dashed border-muted-foreground/30 rounded">
                  Nenhuma tarefa
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}