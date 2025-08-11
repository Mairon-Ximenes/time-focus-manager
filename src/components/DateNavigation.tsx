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
    <div className="flex items-center justify-between gap-4">
      <Button
        onClick={handlePrevious}
        variant="outline"
        size="sm"
        className="transition-all duration-200 hover:bg-primary/10"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {getViewTitle(currentDate, viewMode)}
        </h2>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleToday}
          variant="outline"
          size="sm"
          className="text-primary border-primary hover:bg-primary/10"
        >
          Hoje
        </Button>
        <Button
          onClick={handleNext}
          variant="outline"
          size="sm"
          className="transition-all duration-200 hover:bg-primary/10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}