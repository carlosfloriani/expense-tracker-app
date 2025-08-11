type Expense = {
  id: string;
  date: string; // ISO
  amount: number;
  person: "Carlos" | "Gabreilly";
  type: "Ifood" | "Restaurante";
};

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
  const [year, month] = currentMonth.split("-").map(Number);
  
  // Obter o primeiro dia da semana e total de dias no mês
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = domingo, 1 = segunda, etc.

  // Organizar gastos por dia
  const expensesByDay = new Map<number, Expense[]>();
  for (const expense of expenses) {
    const d = new Date(expense.date);
    const key = ymd(d);
    if (key.startsWith(currentMonth)) {
      const day = d.getDate();
      if (!expensesByDay.has(day)) expensesByDay.set(day, []);
      expensesByDay.get(day)!.push(expense);
    }
  }

  // Calcular quantas semanas precisamos
  const totalCells = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;
  const weeks = Math.ceil(totalCells / 7);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          GASTOS DE {monthNames[month - 1].toUpperCase()} {year}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {/* Cabeçalho com dias da semana */}
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="border border-border bg-muted/50 p-2 text-center text-sm font-medium text-muted-foreground min-w-[120px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Corpo da tabela com os dias */}
          <tbody>
            {Array.from({ length: weeks }, (_, weekIndex) => (
              <tr key={weekIndex}>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const cellIndex = weekIndex * 7 + dayIndex;
                  const dayNumber = cellIndex - startDayOfWeek + 1;
                  const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                  const dayExpenses = isValidDay ? expensesByDay.get(dayNumber) || [] : [];

                  return (
                    <td
                      key={dayIndex}
                      className="border border-border p-1 align-top min-h-[80px] h-20 w-[120px]"
                    >
                      {isValidDay && (
                        <div className="h-full">
                          <div className="mb-1 text-sm font-medium text-muted-foreground">
                            {dayNumber}
                          </div>
                          <div className="space-y-1">
                            {dayExpenses.map((expense) => (
                              <div
                                key={expense.id}
                                className={`px-2 py-1 rounded text-xs font-medium text-center ${
                                  expense.person === "Carlos"
                                    ? "bg-personCarlos text-personCarlos-foreground"
                                    : "bg-personGaby text-personGaby-foreground"
                                }`}
                              >
                                {expense.amount}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-6 rounded bg-personCarlos" />
          <span className="text-muted-foreground">Carlos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-6 rounded bg-personGaby" />
          <span className="text-muted-foreground">Gabreilly</span>
        </div>
      </div>
    </div>
  );
}
