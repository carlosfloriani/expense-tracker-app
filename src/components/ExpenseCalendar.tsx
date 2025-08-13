type Expense = {
  id: string;
  date: string; // ISO
  amount: number;
  person: "Carlos" | "Gabrielly";
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
  onDateSelect,
  onDeleteExpense,
}: {
  expenses: Expense[];
  currentMonth: string; // YYYY-MM
  onDateSelect?: (date: string) => void;
  onDeleteExpense?: (id: string) => void;
}) {
  const [year, month] = currentMonth.split("-").map(Number);
  
  const formatDateForInput = (day: number) => {
    const yyyy = year;
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  
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
      
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full border-collapse border border-border min-w-[700px]">
          {/* Cabeçalho com dias da semana */}
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="border border-border bg-muted/30 p-2 text-center text-xs font-medium text-muted-foreground min-w-[100px]"
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
                      className={`border border-border p-1 align-top min-h-[60px] h-16 w-[100px] ${
                        isValidDay && onDateSelect ? "cursor-pointer hover:bg-muted/30 transition-colors" : ""
                      }`}
                      onClick={() => {
                        if (isValidDay && onDateSelect) {
                          onDateSelect(formatDateForInput(dayNumber));
                        }
                      }}
                    >
                      {isValidDay && (
                        <div className="h-full">
                          <div className="mb-1 text-xs font-medium text-muted-foreground">
                            {dayNumber}
                          </div>
                          <div className="space-y-1">
                            {dayExpenses.map((expense) => (
                              <div
                                key={expense.id}
                                className={`relative px-1 py-0.5 rounded text-xs font-medium text-center flex items-center justify-between group ${
                                  expense.type === "Ifood"
                                    ? `bg-gradient-to-r ${expense.person === "Carlos" ? "from-personCarlos to-ifood" : "from-personGaby to-ifood"} text-white`
                                    : `bg-gradient-to-r ${expense.person === "Carlos" ? "from-personCarlos to-restaurante" : "from-personGaby to-restaurante"} text-white`
                                }`}
                                title={`${expense.person} - ${expense.type} - ${expense.amount}`}
                              >
                                <span className="flex-1">{expense.person.charAt(0)}-{expense.amount}-{expense.type.toLowerCase()}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteExpense?.(expense.id);
                                  }}
                                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-200"
                                  title="Excluir gasto"
                                >
                                  ✕
                                </button>
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
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded bg-personCarlos" />
          <span className="text-muted-foreground">Carlos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded bg-personGaby" />
          <span className="text-muted-foreground">Gabrielly</span>
        </div>
      </div>
    </div>
  );
}
