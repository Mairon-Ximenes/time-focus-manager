import React, { useState } from 'react';
import { Task } from '@/types/task';
import { useTimer } from '@/hooks/useTimer';
import { TimerState } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  Square, 
  Check, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  timerState: TimerState;
  onStart: (taskId: string) => void;
  onToggleTimer: () => void;
  onComplete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  isLocked: boolean;
}

export function TaskCard({
  task,
  timerState,
  onStart,
  onToggleTimer,
  onComplete,
  onUpdate,
  onDelete,
  isLocked
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { totalTime, formatTime } = useTimer(timerState);

  const isActive = task.id === timerState.activeTaskId;
  const isCompleted = task.status === 'completed';
  const showTimer = isActive || task.timeSpent > 0 || isCompleted;

  const handleEdit = () => {
    if (isLocked && !isActive) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  const getCardClassName = () => {
    if (isCompleted) return 'task-completed task-completed-animate';
    if (isActive) return 'task-active';
    return 'task-pending';
  };

  const getCurrentTime = () => {
    if (isActive) {
      return formatTime(totalTime);
    }
    return formatTime(task.timeSpent);
  };

  return (
    <Card 
      className={cn(
        'border-2 transition-all duration-300 animate-fade-in',
        getCardClassName(),
        isLocked && !isActive && 'opacity-60 pointer-events-none'
      )}
      role="article"
      aria-labelledby={`task-title-${task.id}`}
      aria-describedby={task.description ? `task-desc-${task.id}` : undefined}
    >
      <CardHeader className="pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex-1 min-w-0 w-full">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título da tarefa"
                  className="font-semibold"
                  autoFocus
                  aria-label="Editar título da tarefa"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Descrição (opcional)"
                  rows={2}
                  aria-label="Editar descrição da tarefa"
                />
              </div>
            ) : (
              <div>
                <h3 
                  id={`task-title-${task.id}`}
                  className={cn(
                    'font-semibold text-base sm:text-lg leading-tight break-words',
                    isCompleted && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p 
                    id={`task-desc-${task.id}`}
                    className={cn(
                      'text-sm text-muted-foreground mt-1 break-words',
                      isCompleted && 'line-through'
                    )}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Timer Display */}
          {showTimer && (
            <div className={cn(
              'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-mono timer-display shrink-0',
              isActive && 'bg-warning/80 text-warning-foreground',
              isCompleted && 'bg-success/80 text-success-foreground',
              !isActive && !isCompleted && 'bg-muted'
            )}
            role="status"
            aria-label={`Tempo gasto na tarefa: ${getCurrentTime()}`}
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span>{getCurrentTime()}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {isEditing ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleSave}
                size="sm"
                className="btn-success text-success-foreground"
                disabled={!editTitle.trim()}
                aria-label="Salvar alterações na tarefa"
              >
                <Save className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Salvar</span>
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
                aria-label="Cancelar edição da tarefa"
              >
                <X className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Cancelar</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {/* Botões de ação da tarefa */}
              {!isCompleted && !isActive && !isLocked && (
                <Button
                  onClick={() => onStart(task.id)}
                  size="sm"
                  className="btn-primary text-primary-foreground"
                  aria-label={`Iniciar timer para a tarefa ${task.title}`}
                >
                  <Play className="w-4 h-4 mr-1" aria-hidden="true" />
                  Iniciar
                </Button>
              )}

              {isActive && (
                <>
                  <Button
                    onClick={onToggleTimer}
                    size="sm"
                    variant="outline"
                    className="border-warning text-warning hover:bg-warning/10"
                    aria-label={timerState.isRunning ? "Pausar cronômetro" : "Continuar cronômetro"}
                  >
                    {timerState.isRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" aria-hidden="true" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" aria-hidden="true" />
                        Continuar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => onComplete(task.id)}
                    size="sm"
                    className="btn-success text-success-foreground"
                    aria-label={`Marcar tarefa ${task.title} como concluída`}
                  >
                    <Square className="w-4 h-4 mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Terminar</span>
                    <span className="sm:hidden">Ok</span>
                  </Button>
                </>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2 text-success" role="status" aria-label="Tarefa concluída">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Concluída</span>
                </div>
              )}
            </div>
          )}

          {/* Botões de edição e exclusão */}
          {!isEditing && (!isLocked || isActive) && (
            <div className="flex gap-1 shrink-0">
              {!isCompleted && (
                <Button
                  onClick={handleEdit}
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Editar tarefa ${task.title}`}
                >
                  <Edit2 className="w-4 h-4" aria-hidden="true" />
                </Button>
              )}
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Excluir tarefa ${task.title}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a tarefa "<strong>{task.title}</strong>"? 
                      Esta ação não pode ser desfeita e todo o tempo registrado será perdido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir Tarefa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}