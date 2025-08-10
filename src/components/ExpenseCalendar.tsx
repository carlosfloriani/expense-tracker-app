import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Expense = {
  id: string;
  date: string; // ISO
  amount: number;
  person: "Carlos" | "Gabreilly";
  type: "Ifood" | "Restaurante";
};

function parseMonthToDate(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1);
}

function ymd(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ExpenseCalendar({
  expenses,
  currentMonth,
}: {
  expenses: Expense[];
  currentMonth: string; // YYYY-MM
}) {
  const monthDate = parseMonthToDate(currentMonth);

  const perDay = new Map<string, Set<Expense["person"]>>();
  for (const e of expenses) {
    const d = new Date(e.date);
    const key = ymd(d);
    // Only include current month
    if (key.startsWith(currentMonth)) {
      if (!perDay.has(key)) perDay.set(key, new Set());
      perDay.get(key)!.add(e.person);
    }
  }

  const DayContent = (props: any) => {
    const date: Date = props.date;
    const key = ymd(date);
    const s = perDay.get(key);
    const hasCarlos = s?.has("Carlos");
    const hasGaby = s?.has("Gabreilly");

    return (
      <div className="relative flex h-9 w-9 items-center justify-center">
        <span className="text-sm">{date.getDate()}</span>
        {(hasCarlos || hasGaby) && (
          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center gap-1">
            {hasCarlos && <span className="h-1.5 w-3 rounded-full bg-personCarlos" aria-label="Carlos" />}
            {hasGaby && <span className="h-1.5 w-3 rounded-full bg-personGaby" aria-label="Gabreilly" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">{currentMonth}</div>
      <Calendar
        month={monthDate}
        components={{
          DayContent,
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
      />
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-full bg-personCarlos" />
          <span>Carlos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-full bg-personGaby" />
          <span>Gabreilly</span>
        </div>
      </div>
    </div>
  );
}
