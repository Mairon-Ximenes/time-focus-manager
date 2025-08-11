import React, { useState, useEffect } from 'react';
import { ViewMode } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { ViewModeSelector } from '@/components/ViewModeSelector';
import { DateNavigation } from '@/components/DateNavigation';
import { DayView } from '@/components/views/DayView';
import { WeekView } from '@/components/views/WeekView';
import { MonthView } from '@/components/views/MonthView';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function TaskManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  const {
    tasks,
    timerState,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    toggleTimer,
    completeTask,
  } = useTasks();

  // Efeito para recuperar timer em execução ao carregar a página
  useEffect(() => {
    if (timerState.activeTaskId && timerState.isRunning) {
      toast({
        title: "Timer Recuperado",
        description: "Continuando o timer da tarefa ativa.",
        duration: 3000,
      });
    }
  }, []);

  const handleCreateTask = async (title: string, description: string, date: string) => {
    try {
      createTask({ title, description, date });
      toast({
        title: "Tarefa Criada",
        description: `"${title}" foi adicionada com sucesso.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar tarefa",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      updateTask(taskId, updates);
      toast({
        title: "Tarefa Atualizada",
        description: "As alterações foram salvas.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar tarefa",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      deleteTask(taskId);
      toast({
        title: "Tarefa Deletada",
        description: "A tarefa foi removida com sucesso.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao deletar tarefa",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleStartTask = async (taskId: string) => {
    try {
      startTask(taskId);
      const task = tasks.find(t => t.id === taskId);
      toast({
        title: "Tarefa Iniciada",
        description: `Timer iniciado para "${task?.title}".`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao iniciar tarefa",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleToggleTimer = async () => {
    try {
      toggleTimer();
      toast({
        title: timerState.isRunning ? "Timer Pausado" : "Timer Retomado",
        description: timerState.isRunning ? "O cronômetro foi pausado." : "O cronômetro foi retomado.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao controlar o timer",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      completeTask(taskId);
      toast({
        title: "Tarefa Concluída! 🎉",
        description: `"${task?.title}" foi finalizada com sucesso.`,
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao finalizar tarefa",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'day':
        return (
          <DayView
            selectedDate={selectedDate}
            tasks={tasks}
            timerState={timerState}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onStartTask={handleStartTask}
            onToggleTimer={handleToggleTimer}
            onCompleteTask={handleCompleteTask}
          />
        );
      case 'week':
        return (
          <WeekView
            selectedDate={selectedDate}
            tasks={tasks}
            timerState={timerState}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onStartTask={handleStartTask}
            onToggleTimer={handleToggleTimer}
            onCompleteTask={handleCompleteTask}
            onDaySelect={handleDaySelect}
          />
        );
      case 'month':
        return (
          <MonthView
            selectedDate={selectedDate}
            tasks={tasks}
            timerState={timerState}
            onDaySelect={handleDaySelect}
          />
        );
      default:
        return null;
    }
  };

  // Estatísticas rápidas
  const todayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.date === today;
  });

  const todayStats = {
    total: todayTasks.length,
    completed: todayTasks.filter(t => t.status === 'completed').length,
    active: todayTasks.filter(t => t.status === 'active').length,
    pending: todayTasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestão de Tarefas
          </h1>
          <p className="text-muted-foreground">
            Organize seu tempo e aumente sua produtividade
          </p>
        </div>

        {/* Stats Card - apenas para visualização diária */}
        {viewMode === 'day' && todayStats.total > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{todayStats.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <div className="text-2xl font-bold">{todayStats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pendentes</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <div>
                    <div className="text-2xl font-bold">{todayStats.active}</div>
                    <div className="text-sm text-muted-foreground">Ativa{todayStats.active !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <div className="text-2xl font-bold">{todayStats.completed}</div>
                    <div className="text-sm text-muted-foreground">Concluídas</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <ViewModeSelector
            currentMode={viewMode}
            onModeChange={setViewMode}
            className="w-full md:w-auto"
          />
          <DateNavigation
            currentDate={selectedDate}
            viewMode={viewMode}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}