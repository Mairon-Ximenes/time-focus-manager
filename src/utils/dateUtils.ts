import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatar data para exibição
export const formatDate = (date: Date, formatStr: string = 'dd/MM/yyyy') => {
  return format(date, formatStr, { locale: ptBR });
};

// Formatar data para ISO string (YYYY-MM-DD)
export const formatDateISO = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

// Converter string ISO para Date
export const parseISODate = (dateString: string) => {
  return new Date(dateString + 'T00:00:00');
};

// Obter dias da semana atual
export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Domingo
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};

// Obter dias do mês atual
export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

// Navegação de datas
export const navigateDate = (currentDate: Date, direction: 'prev' | 'next', viewMode: 'day' | 'week' | 'month') => {
  switch (viewMode) {
    case 'day':
      return direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
    case 'week':
      return direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
    case 'month':
      return direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
    default:
      return currentDate;
  }
};

// Verificar se duas datas são do mesmo dia
export const isSameDayUtil = (date1: Date, date2: Date) => {
  return isSameDay(date1, date2);
};

// Verificar se a data é hoje
export const isTodayUtil = (date: Date) => {
  return isToday(date);
};

// Obter título da view baseado na data e modo de visualização
export const getViewTitle = (date: Date, viewMode: 'day' | 'week' | 'month') => {
  switch (viewMode) {
    case 'day':
      return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
    case 'week':
      const weekStart = startOfWeek(date, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
      return `${format(weekStart, 'dd MMM', { locale: ptBR })} - ${format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}`;
    case 'month':
      return format(date, 'MMMM yyyy', { locale: ptBR });
    default:
      return '';
  }
};