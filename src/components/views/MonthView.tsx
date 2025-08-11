import React from 'react';
import { Task, TimerState } from '@/types/task';
import { getMonthDays, formatDate, formatDateISO, isTodayUtil, getWeekDays } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { startOfMonth, endOfMonth, eachWeekOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthViewProps {
  selectedDate: Date;
  tasks: Task[];
  timerState: TimerState;
  onDaySelect: (date: Date) => void;
}

export function MonthView({
  selectedDate,
  tasks,
  timerState,
  onDaySelect
}: MonthViewProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });

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

  const isInCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com dias da semana */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semanas do mês */}
      <div className="space-y-4">
        {weeks.map((weekStart, weekIndex) => {
          const weekDays = getWeekDays(weekStart);
          
          return (
            <Card key={weekIndex} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Semana {weekIndex + 1} - {format(weekStart, 'dd MMM', { locale: ptBR })} a {format(weekDays[6], 'dd MMM', { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, dayIndex) => {
                    const dayTasks = getTasksForDay(day);
                    const taskSummary = getTaskCountSummary(dayTasks);
                    const isToday = isTodayUtil(day);
                    const inCurrentMonth = isInCurrentMonth(day);
                    const hasActiveTasks = taskSummary.active > 0;

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          'min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md',
                          !inCurrentMonth && 'opacity-40 bg-muted/30',
                          inCurrentMonth && 'bg-card hover:bg-accent/50',
                          isToday && 'ring-2 ring-primary ring-offset-1',
                          hasActiveTasks && 'shadow-sm shadow-warning/30'
                        )}
                        onClick={() => onDaySelect(day)}
                      >
                        {/* Número do dia */}
                        <div className={cn(
                          'text-lg font-semibold mb-2',
                          isToday && 'text-primary',
                          !inCurrentMonth && 'text-muted-foreground'
                        )}>
                          {formatDate(day, 'dd')}
                        </div>

                        {/* Indicador de hoje */}
                        {isToday && (
                          <div className="text-xs text-primary font-medium mb-2">Hoje</div>
                        )}

                        {/* Resumo de tarefas */}
                        {taskSummary.total > 0 && inCurrentMonth && (
                          <div className="space-y-1">
                            {taskSummary.pending > 0 && (
                              <div className="text-xs bg-muted rounded px-1 py-0.5">
                                {taskSummary.pending} pendente{taskSummary.pending > 1 ? 's' : ''}
                              </div>
                            )}
                            {taskSummary.active > 0 && (
                              <div className="text-xs bg-warning/20 text-warning-foreground rounded px-1 py-0.5">
                                {taskSummary.active} ativa{taskSummary.active > 1 ? 's' : ''}
                              </div>
                            )}
                            {taskSummary.completed > 0 && (
                              <div className="text-xs bg-success/20 text-success-foreground rounded px-1 py-0.5">
                                {taskSummary.completed} concluída{taskSummary.completed > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Lista de tarefas (primeiras 2) */}
                        {inCurrentMonth && (
                          <div className="mt-2 space-y-1">
                            {dayTasks.slice(0, 2).map(task => (
                              <div
                                key={task.id}
                                className={cn(
                                  'text-xs p-1 rounded truncate',
                                  task.status === 'pending' && 'bg-muted text-muted-foreground',
                                  task.status === 'active' && 'bg-warning/20 text-warning-foreground',
                                  task.status === 'completed' && 'bg-success/20 text-success-foreground line-through'
                                )}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayTasks.length - 2} mais
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}