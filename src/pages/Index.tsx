import { useEffect, useMemo, useState } from "react";
import CounterBar from "@/components/CounterBar";
import { toast } from "@/hooks/use-toast";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseCalendar from "@/components/ExpenseCalendar";

// Tipos
type Person = "Carlos" | "Gabreilly";
type ExpenseType = "Ifood" | "Restaurante";

interface Expense {
  id: string;
  date: string; // ISO
  amount: number; // unidades (0.25, 0.5, 0.75, 1)
  person: Person;
  type: ExpenseType;
}

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
  const [expenses, setExpenses] = useState<Expense[]>([]);

// Estados do formulário
const [amount, setAmount] = useState<number>(1);
const [person, setPerson] = useState<Person>("Carlos");
const [type, setType] = useState<ExpenseType>("Ifood"); // pré-selecionado
const [dateStr, setDateStr] = useState<string>(todayStr());

  // Carregar dados do mês atual
  useEffect(() => {
    const m = monthKey();
    setCurrentMonth(m);
    const saved = localStorage.getItem(EXPENSES_KEY(m));
    setExpenses(saved ? (JSON.parse(saved) as Expense[]) : []);

    const defaultsRaw = localStorage.getItem(DEFAULTS_KEY(m));
    if (defaultsRaw) {
      try {
        const d = JSON.parse(defaultsRaw);
        if (d.amount) setAmount(d.amount);
        if (d.person) setPerson(d.person);
        if (d.type) setType(d.type);
      } catch {}
    }
  }, []);

  // Persistir gastos sempre que mudar
  useEffect(() => {
    const m = currentMonth;
    localStorage.setItem(EXPENSES_KEY(m), JSON.stringify(expenses));
  }, [expenses, currentMonth]);

  // Persistir defaults do formulário
  useEffect(() => {
    const m = currentMonth;
    localStorage.setItem(
      DEFAULTS_KEY(m),
      JSON.stringify({ amount, person, type })
    );
  }, [amount, person, type, currentMonth]);

  // Caso o mês mude enquanto app está aberto
  useEffect(() => {
    const id = setInterval(() => {
      const m = monthKey();
      if (m !== currentMonth) {
        setCurrentMonth(m);
        const saved = localStorage.getItem(EXPENSES_KEY(m));
        setExpenses(saved ? (JSON.parse(saved) as Expense[]) : []);
      }
    }, 60_000); // checa a cada minuto
    return () => clearInterval(id);
  }, [currentMonth]);

  const counts = useMemo(() => {
    const byType: Record<ExpenseType, number> = { Ifood: 0, Restaurante: 0 };
    for (const e of expenses) byType[e.type] += 1;
    return byType;
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // valida limites (por unidade)
    const nextCount = counts[type] + 1;
    if (nextCount > LIMITS[type]) {
      toast({
        title: "Limite atingido",
        description: `Você já alcançou o limite de ${LIMITS[type]} para ${type} neste mês.`,
        variant: "destructive",
      });
      return;
    }

const newExpense: Expense = {
      id: crypto.randomUUID(),
      date: toIsoFromLocalDate(dateStr),
      amount,
      person,
      type,
    };
    setExpenses((prev) => [newExpense, ...prev]);

    toast({
      title: "Gasto adicionado",
      description: `${type} • ${person} • ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-8 space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Controle de Gastos Mensais
        </h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CounterBar label="Ifood" count={counts.Ifood} limit={LIMITS.Ifood} />
          <CounterBar
            label="Restaurante"
            count={counts.Restaurante}
            limit={LIMITS.Restaurante}
          />
        </section>
      </header>

      <main className="container pb-16 space-y-8" role="main">
        <section aria-label="Formulário de novo gasto" className="rounded-lg border border-border bg-card p-4 sm:p-6">
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

        <section aria-label="Calendário do mês" className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <ExpenseCalendar expenses={expenses} currentMonth={currentMonth} />
        </section>
        <section aria-label="Lista de gastos" className="space-y-3">
          <h2 className="text-base font-medium text-foreground">
            Gastos do mês ({currentMonth})
          </h2>
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem gastos neste mês.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border bg-card">
              {expenses.map((e) => (
                <li key={e.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{formatDate(e.date)}</span>
                    <span className="text-foreground">{e.person}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-foreground">{e.type}</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {e.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
