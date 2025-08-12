import { useEffect, useMemo, useState } from "react";
import CounterBar from "@/components/CounterBar";
import { toast } from "@/hooks/use-toast";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseCalendar from "@/components/ExpenseCalendar";
import MonthNavigation from "@/components/MonthNavigation";
import { useExpenses, type Person, type ExpenseType } from "@/hooks/useExpenses";

const LIMITS: Record<ExpenseType, number> = {
  Ifood: 10,
  Restaurante: 4,
};

const monthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const EXPENSES_KEY = (m: string) => `expenses-${m}`;
const DEFAULTS_KEY = (m: string) => `defaults-${m}`;

const todayStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const toIsoFromLocalDate = (ymd: string) => {
  // Use 12:00 local time to avoid timezone shifts when converting to ISO
  return new Date(`${ymd}T12:00:00`).toISOString();
};

const Index = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(monthKey());
  const { expenses, loading, addExpense, deleteExpense } = useExpenses(currentMonth);

  // Estados do formulário
  const [amount, setAmount] = useState<number>(1);
  const [person, setPerson] = useState<Person>("Carlos");
  const [type, setType] = useState<ExpenseType>("Ifood");
  const [dateStr, setDateStr] = useState<string>(todayStr());

  // Carregar defaults do formulário do localStorage
  useEffect(() => {
    const defaultsRaw = localStorage.getItem(DEFAULTS_KEY(currentMonth));
    if (defaultsRaw) {
      try {
        const d = JSON.parse(defaultsRaw);
        if (d.amount) setAmount(d.amount);
        if (d.person) setPerson(d.person);
        if (d.type) setType(d.type);
      } catch {}
    }
  }, [currentMonth]);

  // Persistir defaults do formulário
  useEffect(() => {
    localStorage.setItem(
      DEFAULTS_KEY(currentMonth),
      JSON.stringify({ amount, person, type })
    );
  }, [amount, person, type, currentMonth]);

  const counts = useMemo(() => {
    const byType: Record<ExpenseType, number> = { Ifood: 0, Restaurante: 0 };
    const totalsByType: Record<ExpenseType, number> = { Ifood: 0, Restaurante: 0 };
    
    for (const e of expenses) {
      byType[e.type] += 1;
      totalsByType[e.type] += e.amount;
    }
    
    return { byType, totalsByType };
  }, [expenses]);

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (date: string) => {
    setDateStr(date);
    toast({
      title: "Data selecionada",
      description: `Data ${new Date(date + 'T12:00:00').toLocaleDateString("pt-BR")} configurada no formulário`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // valida limites (por unidade)
    const nextCount = counts.byType[type] + 1;
    if (nextCount > LIMITS[type]) {
      toast({
        title: "Limite atingido",
        description: `Você já alcançou o limite de ${LIMITS[type]} para ${type} neste mês.`,
        variant: "destructive",
      });
      return;
    }

    const newExpense = {
      date: toIsoFromLocalDate(dateStr),
      amount,
      person,
      type,
    };
    
    await addExpense(newExpense);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header fixo */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4 space-y-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground text-center">
            Soft Spend Diary
          </h1>
          
          {/* Contadores em linha */}
          <div className="grid grid-cols-2 gap-3">
            <CounterBar label="Ifood" count={counts.byType.Ifood} limit={LIMITS.Ifood} />
            <CounterBar
              label="Restaurante"
              count={counts.byType.Restaurante}
              limit={LIMITS.Restaurante}
            />
          </div>
        </div>
      </header>

      <main className="container py-4 space-y-6" role="main">
        {/* Formulário */}
        <section aria-label="Formulário de novo gasto" className="rounded-2xl border border-border bg-card p-4">
          <ExpenseForm
            amount={amount}
            setAmount={setAmount}
            person={person}
            setPerson={setPerson}
            type={type}
            setType={setType}
            dateStr={dateStr}
            setDateStr={setDateStr}
            onSubmit={handleSubmit}
          />
        </section>

        {/* Navegação do mês */}
        <section>
          <MonthNavigation currentMonth={currentMonth} onMonthChange={handleMonthChange} />
        </section>

        {/* Calendário */}
        <section aria-label="Calendário do mês" className="rounded-2xl border border-border bg-card p-4 overflow-hidden">
          <ExpenseCalendar 
            expenses={expenses} 
            currentMonth={currentMonth} 
            onDateSelect={handleDateSelect}
          />
        </section>

        {/* Totais */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Ifood</div>
            <div className="text-lg font-bold text-foreground mt-1">
              {counts.totalsByType.Ifood.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Restaurante</div>
            <div className="text-lg font-bold text-foreground mt-1">
              {counts.totalsByType.Restaurante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </section>
        
        {/* Lista de gastos */}
        <section aria-label="Lista de gastos" className="space-y-3 pb-6">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            Gastos de {currentMonth}
          </h2>
          {expenses.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhum gasto registrado este mês</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((e) => (
                <div key={e.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        e.person === "Carlos" ? "bg-personCarlos" : "bg-personGaby"
                      }`} />
                      <div className="text-sm">
                        <div className="font-medium text-foreground">{e.person}</div>
                        <div className="text-muted-foreground">{formatDate(e.date)}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-foreground">{e.type}</div>
                        <div className="text-muted-foreground">
                          {e.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
                      aria-label="Excluir gasto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;