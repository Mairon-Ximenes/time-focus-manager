import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { ViewMode } from '@/types/task';
import { cn } from '@/lib/utils';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewModeSelector({ currentMode, onModeChange, className }: ViewModeSelectorProps) {
  const modes = [
    { value: 'day' as ViewMode, label: 'Dia', icon: Calendar },
    { value: 'week' as ViewMode, label: 'Semana', icon: CalendarDays },
    { value: 'month' as ViewMode, label: 'Mês', icon: CalendarRange },
  ];

  return (
    <div className={cn('flex bg-muted rounded-lg p-1', className)}>
      {modes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          onClick={() => onModeChange(value)}
          variant={currentMode === value ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            'flex-1 text-sm transition-all duration-200',
            currentMode === value && 'btn-primary text-primary-foreground shadow-sm'
          )}
        >
          <Icon className="w-4 h-4 mr-1" />
          {label}
        </Button>
      ))}
    </div>
  );
}