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
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título da tarefa"
                  className="font-semibold"
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Descrição (opcional)"
                  rows={2}
                />
              </div>
            ) : (
              <div>
                <h3 className={cn(
                  'font-semibold text-lg leading-tight',
                  isCompleted && 'line-through text-muted-foreground'
                )}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={cn(
                    'text-sm text-muted-foreground mt-1',
                    isCompleted && 'line-through'
                  )}>
                    {task.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Timer Display */}
          {showTimer && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono timer-display',
              isActive && 'bg-warning/80 text-warning-foreground',
              isCompleted && 'bg-success/80 text-success-foreground',
              !isActive && !isCompleted && 'bg-muted'
            )}>
              <Clock className="w-4 h-4" />
              <span>{getCurrentTime()}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="btn-success text-success-foreground"
                disabled={!editTitle.trim()}
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Botões de ação da tarefa */}
              {!isCompleted && !isActive && !isLocked && (
                <Button
                  onClick={() => onStart(task.id)}
                  size="sm"
                  className="btn-primary text-primary-foreground"
                >
                  <Play className="w-4 h-4 mr-1" />
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
                  >
                    {timerState.isRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Continuar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => onComplete(task.id)}
                    size="sm"
                    className="btn-success text-success-foreground"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Terminar
                  </Button>
                </>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Concluída</span>
                </div>
              )}
            </div>
          )}

          {/* Botões de edição e exclusão */}
          {!isEditing && (!isLocked || isActive) && (
            <div className="flex gap-1">
              {!isCompleted && (
                <Button
                  onClick={handleEdit}
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a tarefa "{task.title}"? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
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