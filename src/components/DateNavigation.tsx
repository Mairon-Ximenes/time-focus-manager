import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewMode } from '@/types/task';
import { getViewTitle, navigateDate } from '@/utils/dateUtils';

interface DateNavigationProps {
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
}

export function DateNavigation({ currentDate, viewMode, onDateChange }: DateNavigationProps) {
  const handlePrevious = () => {
    const newDate = navigateDate(currentDate, 'prev', viewMode);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = navigateDate(currentDate, 'next', viewMode);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center gap-1 w-full">
      <Button
        onClick={handlePrevious}
        variant="outline"
        size="sm"
        className="transition-all duration-200 hover:bg-primary/10 shrink-0 px-2"
        aria-label="Período anterior"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">Anterior</span>
      </Button>

      <div className="flex-1 text-center min-w-0 px-2">
        <h2 className="text-lg font-semibold text-foreground truncate">
          {getViewTitle(currentDate, viewMode)}
        </h2>
      </div>

      <Button
        onClick={handleToday}
        variant="outline"
        size="sm"
        className="text-primary border-primary hover:bg-primary/10 text-xs px-2 shrink-0"
        aria-label="Ir para hoje"
      >
        <span className="hidden sm:inline">Hoje</span>
        <span className="sm:hidden">Hj</span>
      </Button>
      
      <Button
        onClick={handleNext}
        variant="outline"
        size="sm"
        className="transition-all duration-200 hover:bg-primary/10 shrink-0 px-2"
        aria-label="Próximo período"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">Próximo</span>
      </Button>
    </div>
  );
}