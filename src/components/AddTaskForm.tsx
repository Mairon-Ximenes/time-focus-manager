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
      <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Não é possível criar tarefas enquanto uma tarefa está ativa</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isExpanded) {
    return (
      <Card 
        className="border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Adicionar nova tarefa</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Nova Tarefa</CardTitle>
          <Button
            onClick={handleCancel}
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da tarefa"
              autoFocus
              required
            />
          </div>
          <div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary text-primary-foreground"
              disabled={!title.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Criar Tarefa
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}