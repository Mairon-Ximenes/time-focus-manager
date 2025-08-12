import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { formatDateISO } from '@/utils/dateUtils';

interface AddTaskFormProps {
  selectedDate: Date;
  onAddTask: (title: string, description: string, date: string) => void;
  isLocked: boolean;
}

export function AddTaskForm({ selectedDate, onAddTask, isLocked }: AddTaskFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim(), formatDateISO(selectedDate));
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  if (isLocked) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/30" role="status" aria-live="polite">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm sm:text-base">
              Conclua ou pause a tarefa ativa para criar uma nova tarefa
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isExpanded) {
    return (
      <Card 
        className="border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        onClick={() => setIsExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Clique para adicionar uma nova tarefa"
      >
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="font-medium text-sm sm:text-base">Adicionar nova tarefa</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary shadow-lg animate-fade-in" role="form" aria-labelledby="new-task-title">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle id="new-task-title" className="text-base sm:text-lg">Nova Tarefa</CardTitle>
          <Button
            onClick={handleCancel}
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Fechar formulário de nova tarefa"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="task-title" className="sr-only">
              Título da tarefa
            </label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da tarefa"
              autoFocus
              required
              aria-describedby="title-hint"
              className="text-sm sm:text-base"
            />
            <span id="title-hint" className="sr-only">
              Campo obrigatório. Insira um título descritivo para sua tarefa.
            </span>
          </div>
          <div>
            <label htmlFor="task-description" className="sr-only">
              Descrição da tarefa
            </label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={3}
              aria-describedby="description-hint"
              className="text-sm sm:text-base resize-none"
            />
            <span id="description-hint" className="sr-only">
              Campo opcional. Adicione detalhes sobre a tarefa se necessário.
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary text-primary-foreground w-full sm:w-auto order-1 sm:order-2"
              disabled={!title.trim()}
              aria-describedby="create-task-hint"
            >
              <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
              Criar Tarefa
            </Button>
            <span id="create-task-hint" className="sr-only">
              Criar nova tarefa com o título especificado
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}