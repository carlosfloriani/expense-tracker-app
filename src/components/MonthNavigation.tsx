import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  currentMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
};

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthNavigation({ currentMonth, onMonthChange }: Props) {
  const [year, month] = currentMonth.split("-").map(Number);
  
  const handlePrevMonth = () => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    onMonthChange(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
  };
  
  const handleNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    onMonthChange(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
  };
  
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevMonth}
        className="rounded-full h-10 w-10 p-0"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h2 className="text-base font-semibold text-foreground">
        {monthNames[month - 1]} {year}
      </h2>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextMonth}
        className="rounded-full h-10 w-10 p-0"
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}